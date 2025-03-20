import { Sequelize } from "sequelize"
import db from '../models'
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

export async function insertCategory(req, res) {
  try {
    console.log(db.Category,req.body)
    const category = await db.Category.create(req.body);
    res.status(201).json({
      message: "Thêm mới danh mục thành công",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm danh mục mới",
      error: error.message,
    });
  }
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
