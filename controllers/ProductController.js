export function getProducts(req,res) {
  res.status(200).json({
    message: 'Lấy danh sách sản phẩm thành công'
  })
}
export function getProductById(req,res) {
  res.status(200).json({
    message: 'Lấy thông tin sản phẩm thành công'
  })
}
export function insertProduct(req,res) {
  res.status(200).json({
    message: 'Thêm mới sản phẩm thành công'
  })
}
export function deleteProduct(req,res) {
  res.status(200).json({
    message: 'Xóa sản phẩm thành công'
  })
}
export function updateProduct(req,res) {
  res.status(200).json({
    message: 'Cập nhật sản phẩm thành công'
  })
}