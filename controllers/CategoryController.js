export function getCategories(req, res) {
  res.status(200).json({
    message: 'Lấy danh sách danh mục thành công'
  });
}

export function getCategoryById(req, res) {
  res.status(200).json({
    message: 'Lấy thông tin danh mục thành công'
  });
}

export function insertCategory(req, res) {
  res.status(200).json({
    message: 'Thêm mới danh mục thành công'
  });
}

export function deleteCategory(req, res) {
  res.status(200).json({
    message: 'Xóa danh mục thành công'
  });
}

export function updateCategory(req, res) {
  res.status(200).json({
    message: 'Cập nhật danh mục thành công'
  });
}
