import { Sequelize, DataTypes, Op } from "sequelize";
import db from '../models';

export async function getCarts(req, res) {
  const { session_id, user_id, page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (session_id) whereClause.session_id = session_id;
  if (user_id) whereClause.user_id = user_id;

  const [carts, totalCarts] = await Promise.all([
    db.Cart.findAll({
      where: whereClause,
      include: [{
        model: db.CartItem,
        as: 'cart_items'
      }],
      limit: pageSize,
      offset
    }),
    db.Cart.count({
      where: whereClause
    })
  ]);

  res.status(200).json({
    message: 'Lấy danh sách giỏ hàng thành công',
    data: carts,
    currentPage: parseInt(page, 10),
    totalCarts
  });
}

export async function getCartById(req, res) {
  const { id } = req.params;
  const cart = await db.Cart.findByPk(id, {
    include: [{
      model: db.CartItem,
      as: 'cart_items'
    }]
  });
  res.status(200).json({
    message: 'Lấy thông tin giỏ hàng thành công',
    data: cart
  });
}

export const insertCart = async (req, res) => {
  const { session_id, user_id } = req.body;

  // Kiểm tra điều kiện: session_id và user_id không được đồng thời null hoặc đồng thời có giá trị
  if ((!session_id && !user_id) || (session_id && user_id)) {
    return res.status(400).json({
      message: 'session_id và user_id không được đồng thời null hoặc đồng thời có giá trị.'
    });
  }
  // Kiểm tra xem giỏ hàng với session_id hoặc user_id đã tồn tại hay chưa
  const existingCart = await db.Cart.findOne({
    where: session_id
      ? { session_id } // Nếu session_id có giá trị, kiểm tra theo session_id
      : { user_id }    // Nếu không, kiểm tra theo user_id
  });

  if (existingCart) {
    return res.status(409).json({
      message: 'Giỏ hàng với session_id hoặc user_id này đã tồn tại.'
    });
  }
  // Tạo giỏ hàng mới
  const newCart = await db.Cart.create({ session_id, user_id });
  res.status(201).json({
    message: 'Thêm mới giỏ hàng thành công',
    data: newCart
  });

};
export const checkoutCart = async (req, res) => {
  const { cart_id, total, note } = req.body;
  // Kiểm tra xem cart_id có tồn tại và không rỗng
  const cart = await db.Cart.findByPk(cart_id, {
    include: [{
      model: db.CartItem,
      as: 'cart_items',
      include: [{
        model: db.Product,
        as: 'product_list'
      }]
    }]
  });

  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    return res.status(400).json({
      message: 'Giỏ hàng không tồn tại hoặc không có sản phẩm nào trong giỏ hàng.'
    });
  }

  // Bắt đầu giao dịch
  const transaction = await db.sequelize.transaction();
  try {
    // Thêm vào bảng Order
    const newOrder = await db.Order.create(
      {
        session_id: cart.session_id,
        user_id: cart.user_id,
        total: total || cart.cart_items.reduce((acc,item) => acc + item.quantity * item.product_list.price, 0),
        note: note || ""
      },
      { transaction }
    );

    // Thêm các mục giỏ hàng vào OrderDetail
    for (const item of cart.cart_items) {
      await db.OrderDetail.create(
        {
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product_list.price
        },
        { transaction }
      );
    }

    // Nếu total = null, tính lại tổng giá trị từ giỏ hàng
    if (!total) {
      const calculatedTotal = cart.cart_items.reduce(
        (sum, item) => sum + item.quantity * item.product_list.price,
        0
      );

      await newOrder.update({ total: calculatedTotal }, { transaction });
    }

    // Xóa giỏ hàng và các mục giỏ hàng liên quan
    await db.CartItem.destroy({ where: { cart_id:cart.id }}, {transaction:transaction });
    await cart.destroy({transaction:transaction})

    // Hoàn tất giao dịch
    await transaction.commit();

    res.status(200).json({
      message: 'Thanh toán thành công',
      data: newOrder
    });
  } catch (error) {
    // Rollback nếu có lỗi
    await transaction.rollback();
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình thanh toán.',
      error: error.message
    });
  }
};


export async function deleteCart(req, res) {
  const { id } = req.params;
  const deleted = await db.Cart.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
  }
  res.status(200).json({ message: 'Xóa giỏ hàng thành công' });
}

// export async function updateCart(req, res) {
//   const { id } = req.params;
//   const { session_id, user_id } = req.body;

//   // Kiểm tra xem giỏ hàng có tồn tại không
//   const existingCart = await db.Cart.findByPk(id);
//   if (!existingCart) {
//     return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
//   }

//   // Cập nhật giỏ hàng
//   await db.Cart.update(req.body, { where: { id } });

//   // Lấy giỏ hàng đã cập nhật
//   const updatedCart = await db.Cart.findByPk(id);
//   res.status(200).json({
//     message: 'Cập nhật giỏ hàng thành công',
//     data: updatedCart
//   });
// }
