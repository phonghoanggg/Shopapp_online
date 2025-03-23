import { Sequelize } from "sequelize"
import {Op} from "sequelize"
import db from '../models'
import InsertProductRequest from "../dtos/requests/product/InsertProductRequest"
export async function getProducts(req,res) {
  const {search ="", page = 1} = req.query
  console.log(req.query)
  const pageSize = 5
  const offSet = (page - 1) * pageSize
  let whereClause = {}
  if (search.trim() !== '') {
    whereClause = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { specification: { [Op.like]: `%${search}%` } }
      ]
    }
  }

  const [products, totalProducts] = await Promise.all([
    db.Product.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offSet
    }),
    db.Product.count({
      where: whereClause
    })
  ])

  res.status(200).json({
    message: 'Lấy danh sách sản phẩm thành công',
    data: products,
    currentPage: parseInt(page,10),
    totalPage: Math.ceil(totalProducts / pageSize),
    totalProducts
  })
}
export async function getProductById(req,res) {
  const {id} = req.params
  const product = await db.Product.findByPk(id)
  if(!product) {
    return res.status(404).json({
      message:"Không tìm thấy sản phẩm"
    })
  }
  res.status(200).json({
    message: 'Lấy thông tin sản phẩm thành công',
    data: product
  })
}
export async function insertProduct(req, res) {
  const products = await db.Product.create(req.body)
  res.status(201).json({
    message: 'Thêm mới sản phẩm thành công',
    data: products
  })
}
export async function deleteProduct(req, res) {
  const { id } = req.params;
  const deleted = await db.Product.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }
  res.status(200).json({ message: 'Xóa sản phẩm thành công' });
}
export async function updateProduct(req, res) {
  const { id } = req.params;
  const [updated] = await db.Product.update(req.body, {
    where: { id }
  });
  if (!updated) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }
  const updatedProduct = await db.Product.findByPk(id);
  res.status(200).json({
    message: 'Cập nhật sản phẩm thành công',
    data: updatedProduct
  });
}