export function getOrderDetails(req, res) {
  res.status(200).json({
    message: 'Lấy danh sách chi tiết đơn hàng thành công'
  });
}

export function getOrderDetailById(req, res) {
  res.status(200).json({
    message: 'Lấy thông tin chi tiết đơn hàng thành công'
  });
}

export function insertOrderDetail(req, res) {
  res.status(200).json({
    message: 'Thêm mới chi tiết đơn hàng thành công'
  });
}

export function deleteOrderDetail(req, res) {
  res.status(200).json({
    message: 'Xóa chi tiết đơn hàng thành công'
  });
}

export function updateOrderDetail(req, res) {
  res.status(200).json({
    message: 'Cập nhật chi tiết đơn hàng thành công'
  });
}
