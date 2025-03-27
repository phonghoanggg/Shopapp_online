import { Sequelize } from "sequelize"
import db from '../models'
import {Op} from "sequelize"
export async function getCategories(req, res) {
  const { search = "", page = 1 } = req.query;
  console.log(search)
  const pageSize = 5;
  const offset = (page - 1) * pageSize;
  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
      ]
    };
  }
  const [categories, totalCategories] = await Promise.all([
    db.Category.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset
    }),
    db.Category.count({
      where: whereClause
    })
  ]);
  return res.status(200).json({
    message: "Lấy danh sách danh mục thành công",
    data: categories,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalCategories / pageSize),
    totalCategories
  });
}

export async function getCategoryById(req, res) {
  const {id} = req.params
  const category = await db.Category.findByPk(id)
  res.status(200).json({
    message: 'Lấy thông tin danh mục thành công',
    data: category
  });
}

export async function insertCategory(req, res) {
  const category = await db.Category.create(req.body);
  res.status(201).json({
    message: "Thêm mới danh mục thành công",
    data: category,
  });
}
export async function deleteCategory(req, res) {
  const { id } = req.params;
  const deleted = await db.Category.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: 'Danh mục không tồn tại' });
  }
  res.status(200).json({ message: 'Xóa danh mục thành công' });
}
export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  // Kiểm tra xem danh mục có tồn tại không
  const existingCategory = await db.Category.findByPk(id);
  if (!existingCategory) {
    return res.status(404).json({ message: 'Danh mục không tồn tại' });
  }
  if(name) {
    // Kiểm tra xem tên danh mục mới có bị trùng với danh mục khác không
    const duplicateCategory = await db.Category.findOne({
      where: { name, id: { [Op.ne]: id } } // Loại trừ chính danh mục đang cập nhật
    });
  
    if (duplicateCategory) {
      return res.status(400).json({ message: 'Tên danh mục đã tồn tại, vui lòng chọn tên khác' });
    }
  }
  // Cập nhật danh mục
  await db.Category.update(req.body, { where: { id } });
  // Lấy danh mục đã cập nhật
  const updatedCategory = await db.Category.findByPk(id);
  res.status(200).json({
    message: 'Cập nhật danh mục thành công',
    data: updatedCategory
  });
}
