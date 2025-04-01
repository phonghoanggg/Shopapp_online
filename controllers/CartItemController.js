import { Sequelize, DataTypes, Op } from "sequelize";
import db from '../models';

export async function getCartItems(req, res) {
  const { cart_id, product_id, page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (cart_id) whereClause.cart_id = cart_id;
  if (product_id) whereClause.product_id = product_id;

  const [cartItems, totalCartItems] = await Promise.all([
    db.CartItem.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
    }),
    db.CartItem.count({
      where: whereClause
    })
  ]);

  res.status(200).json({
    message: 'Lấy danh sách các mục trong giỏ hàng thành công',
    data: cartItems,
    currentPage: parseInt(page, 10),
    totalCartItems
  });
}

export async function getCartItemsByCartId(req, res) {
  const { cart_id } = req.params;

  // Kiểm tra xem cart_id có được cung cấp hay không
  if (!cart_id) {
    return res.status(400).json({
      message: 'Phải cung cấp cart_id để lấy danh sách các mục giỏ hàng.'
    });
  }

  // Tìm tất cả các mục giỏ hàng theo cart_id
  const cartItems = await db.CartItem.findAll({
    where: { cart_id }
  });
  // Trả về danh sách các mục giỏ hàng
  return res.status(200).json({
    message: 'Lấy danh sách các mục giỏ hàng thành công',
    data: cartItems
  });
}

export const insertCartItem = async (req, res) => {
  const { product_id, quantity, cart_id } = req.body;

  // Kiểm tra xem sản phẩm có tồn tại không
  const productExists = await db.Product.findByPk(product_id);
  if (!productExists) {
    return res.status(404).json({
      message: 'Sản phẩm không tồn tại!'
    });
  }
  if(productExists.quantity < quantity) {
    return res.status(400).json({
      message: 'Sản phẩm không đủ số lượng yêu cầu!'
    });
  }

  // Kiểm tra xem giỏ hàng có tồn tại không
  const cartExists = await db.Cart.findByPk(cart_id);
  if (!cartExists) {
    return res.status(404).json({
      message: 'Giỏ hàng không tồn tại!'
    });
  }

  // Kiểm tra xem mục giỏ hàng với product_id và cart_id đã tồn tại hay chưa
  const existingCartItem = await db.CartItem.findOne({
    where: {
      product_id,
      cart_id
    }
  });

  if (existingCartItem) {
    // Nếu mục giỏ hàng đã tồn tại và quantity là 0, xóa mục giỏ hàng
    if (quantity === 0) {
      await db.CartItem.destroy({ where: { id: existingCartItem.id } });
      return res.status(200).json({
        message: 'Đã xóa mục trong giỏ hàng thành công'
      });
    }

    // Nếu mục giỏ hàng đã tồn tại, cập nhật số lượng
    existingCartItem.quantity = quantity;
    await existingCartItem.save();
    return res.status(200).json({
      message: 'Cập nhật mục trong giỏ hàng thành công',
      data: existingCartItem
    });
  }

  // Nếu mục giỏ hàng chưa tồn tại và quantity là 0, trả về lỗi
  if (quantity === 0) {
    return res.status(400).json({
      message: 'Số lượng phải lớn hơn 0 để thêm mới mục trong giỏ hàng'
    });
  }

  // Tạo mục trong giỏ hàng mới nếu chưa tồn tại
  const newCartItem = await db.CartItem.create({ product_id, quantity, cart_id });
  return res.status(201).json({
    message: 'Thêm mới mục trong giỏ hàng thành công',
    data: newCartItem
  });
};


export async function deleteCartItem(req, res) {
  const { id } = req.params;
  const deleted = await db.CartItem.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: 'Mục giỏ hàng không tồn tại' });
  }
  res.status(200).json({ message: 'Xóa mục giỏ hàng thành công' });
}

export async function updateCartItem(req, res) {
  const { id } = req.params;
  const { cart_id, product_id, quantity } = req.body;

  // Kiểm tra xem mục giỏ hàng có tồn tại không
  const existingCartItem = await db.CartItem.findByPk(id);
  if (!existingCartItem) {
    return res.status(404).json({ message: 'Mục giỏ hàng không tồn tại' });
  }

  // Cập nhật mục giỏ hàng
  await db.CartItem.update(req.body, { where: { id } });

  // Lấy mục giỏ hàng đã cập nhật
  const updatedCartItem = await db.CartItem.findByPk(id);
  res.status(200).json({
    message: 'Cập nhật mục giỏ hàng thành công',
    data: updatedCartItem
  });
}
