import { Sequelize } from "sequelize"
import db from '../models'
import {Op} from "sequelize"
export async function getBrands(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;
  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        // { description: { [Op.like]: `%${search}%` } }
      ]
    };
  }
  const [categories, totalCategories] = await Promise.all([
    db.Brand.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset
    }),
    db.Brand.count({
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

export async function getBrandById(req, res) {
  const { id } = req.params
  const brand = await db.Brand.findByPk(id)
  res.status(200).json({
    message: 'Lấy thông tin thương hiệu thành công',
    data: brand
  });
}

export async function insertBrand(req, res) {
  const brand = await db.Brand.create(req.body);
  res.status(201).json({
    message: "Thêm mới thương hiệu thành công",
    data: brand,
  });
}
export async function deleteBrand(req, res) {
  const { id } = req.params;
  const deleted = await db.Brand.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: 'Thương hiệu không tồn tại' });
  }
  res.status(200).json({ message: 'Xóa thương hiệu thành công' });
}
export async function updateBrand(req, res) {
  const { id } = req.params;
  const [updated] = await db.Brand.update(req.body, { where: { id } });
  if (!updated) {
    return res.status(404).json({ message: 'Thương hiệu không tồn tại' });
  }
  const updatedBrand = await db.Brand.findByPk(id);
  res.status(200).json({
    message: 'Cập nhật thương hiệu thành công',
    data: updatedBrand
  })
}