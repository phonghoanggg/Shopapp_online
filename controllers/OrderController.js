export function getOrders(req, res) {
  res.status(200).json({
    message: 'Lấy danh sách đơn hàng thành công'
  });
}

export function getOrderById(req, res) {
  res.status(200).json({
    message: 'Lấy thông tin đơn hàng thành công'
  });
}

export function insertOrder(req, res) {
  res.status(200).json({
    message: 'Thêm mới đơn hàng thành công'
  });
}

export function deleteOrder(req, res) {
  res.status(200).json({
    message: 'Xóa đơn hàng thành công'
  });
}

export function updateOrder(req, res) {
  res.status(200).json({
    message: 'Cập nhật đơn hàng thành công'
  });
}
