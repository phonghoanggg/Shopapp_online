import { Sequelize } from "sequelize"
import db from '../models'
export async function getOrderDetails(req, res) {
  const orderDetails = await db.OrderDetail.findAll();
  res.status(200).json({
    message: 'Lấy danh sách chi tiết đơn hàng thành công',
    data: orderDetails
  });
}

export async function getOrderDetailById(req, res) {
  const { id } = req.params;
  const orderDetail = await db.OrderDetail.findByPk(id);
  if (!orderDetail) {
    return res.status(404).json({ message: 'Chi tiết đơn hàng không tồn tại' });
  }
  res.status(200).json({
    message: 'Lấy thông tin chi tiết đơn hàng thành công',
    data: orderDetail
  });
}

export async function insertOrderDetail(req, res) {
  const newOrderDetail = await db.OrderDetail.create(req.body);
  res.status(201).json({
    message: 'Thêm mới chi tiết đơn hàng thành công',
    data: newOrderDetail
  });
}

export async function deleteOrderDetail(req, res) {
  const { id } = req.params;
  const deleted = await db.OrderDetail.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: 'Chi tiết đơn hàng không tồn tại' });
  }
  res.status(200).json({ message: 'Xóa chi tiết đơn hàng thành công' });
}

export async function updateOrderDetail(req, res) {
  const { id } = req.params;
  const [updated] = await db.OrderDetail.update(req.body, { where: { id } });
  if (!updated) {
    return res.status(404).json({ message: 'Chi tiết đơn hàng không tồn tại' });
  }
  const updatedOrderDetail = await db.OrderDetail.findByPk(id);
  res.status(200).json({
    message: 'Cập nhật chi tiết đơn hàng thành công',
    data: updatedOrderDetail
  });
}
