import { Sequelize } from "sequelize"
import db from '../models'
import { OrderStatus } from "../constants";
export async function getOrders(req, res) {
  const {search = '', page = 1, status } = req.body
  const pageSize = 6; 
  const offset = (page - 1) * pageSize;
  // Tạo điều kiện lọc
  let whereClause = {};
  if (search && search.trim() !== '') {
    whereClause = {
      [Op.or]: [
        { note: { [Op.like]: `%${search}%` } }
      ]
    };
  }

  if (status) {
    whereClause.status = status;
  }

  // Truy vấn cơ sở dữ liệu
  const [orders, totalOrders] = await Promise.all([
    db.Order.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      order: [['created_at', 'DESC']] // Sắp xếp theo ngày tạo, mới nhất trước
    }),
    db.Order.count({ where: whereClause }) // Đếm tổng số đơn hàng theo điều kiện lọc
  ]);

  // Trả về kết quả
  res.status(200).json({
    message: 'Lấy danh sách đơn hàng thành công',
    data: orders,
    total: totalOrders,
    page: page,
    pageSize: pageSize
  });
}

export async function getOrderById(req, res) {
  const { id } = req.params;
  // Tìm đơn hàng theo ID, bao gồm cả chi tiết đơn hàng
  const order = await db.Order.findByPk(id, {
    include: {
      model: db.OrderDetail,
      as: "order_details", // Alias phải đúng như trong model
    },
  });
  if (!order) {
    return res.status(404).json({
      message: "Đơn hàng không tìm thấy",
    });
  }

  // Trả về dữ liệu đơn hàng
  res.status(200).json({
    message: "Lấy thông tin đơn hàng thành công",
    data: order,
  });
}

// export async function insertOrder(req, res) {
//   const { user_id } = req.body;
//   // Tìm người dùng trong database
//   const user = await db.User.findByPk(user_id);
//   if (!user) {
//     return res.status(404).json({ message: 'Người dùng không tồn tại' });
//   }
//   const newOrder = await db.Order.create(req.body);
//   res.status(201).json({
//     message: 'Thêm mới đơn hàng thành công',
//     data: newOrder
//   });
// }

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  // Cập nhật trạng thái đơn hàng thành FAILED
  const [updated] = await db.Order.update(
    { status: OrderStatus.FAILED }, // Trạng thái thất bại
    { where: { id } }
  );

  if (updated) {
    return res.status(200).json({
      message: 'Đơn hàng đã được cập nhật trạng thái thành FAILED'
    });
  } else {
    return res.status(404).json({
      message: 'Không tìm thấy đơn hàng với ID được cung cấp'
    });
  }
};


export async function updateOrder(req, res) {
  const { id } = req.params;
  try {
    const [updated] = await db.Order.update(req.body, { where: { id } });
    if (!updated) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    const updatedOrder = await db.Order.findByPk(id);
    res.status(200).json({
      message: 'Cập nhật đơn hàng thành công',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật đơn hàng', error: error.message });
  }
}
