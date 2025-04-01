import { Sequelize } from "sequelize"
import db from '../models'
export async function getOrders(req, res) {
  const orders = await db.Order.findAll()
  res.status(200).json({
    message: 'Lấy danh sách đơn hàng thành công',
    data:orders
  });
}

export async function getOrderById(req, res) {
  const { id } = req.params; // Lấy ID từ URL
  // Tìm đơn hàng theo ID, bao gồm cả chi tiết đơn hàng
  const order = await db.Order.findByPk(id, {
    include: {
      model: db.OrderDetail,
      as: "order_details", // Alias phải đúng như trong model
    },
  });

  // Nếu không tìm thấy đơn hàng
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

export async function insertOrder(req, res) {
  const { user_id } = req.body;
  // Tìm người dùng trong database
  const user = await db.User.findByPk(user_id);
  if (!user) {
    return res.status(404).json({ message: 'Người dùng không tồn tại' });
  }
  const newOrder = await db.Order.create(req.body);
  res.status(201).json({
    message: 'Thêm mới đơn hàng thành công',
    data: newOrder
  });
}

export async function deleteOrder(req, res) {
  const { id } = req.params;
  try {
    const deleted = await db.Order.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    res.status(200).json({ message: 'Xóa đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error: error.message });
  }
}

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
