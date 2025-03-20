export function getBrands(req, res) {
  res.status(200).json({
    message: 'Lấy danh sách thương hiệu thành công'
  });
}

export function getBrandById(req, res) {
  res.status(200).json({
    message: 'Lấy thông tin thương hiệu thành công'
  });
}

export function insertBrand(req, res) {
  res.status(200).json({
    message: 'Thêm mới thương hiệu thành công'
  });
}

export function deleteBrand(req, res) {
  res.status(200).json({
    message: 'Xóa thương hiệu thành công'
  });
}

export function updateBrand(req, res) {
  res.status(200).json({
    message: 'Cập nhật thương hiệu thành công'
  });
}
