import { Sequelize } from "sequelize"
import db from '../models'
import InsertProductRequest from "../dtos/requests/InsertProductRequest"
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
export async function insertProduct(req, res) {
  const { error } = InsertProductRequest.validate(req.body)
  // Lỗi phía user request 
  if (error) {
    return res.status(400).json({
      message: "Lỗi khi thêm sản phẩm mới",
      errors: error.details[0]?.message
    })
  }
  const products = await db.Product.create(req.body)
  res.status(201).json({
    message: 'Thêm mới sản phẩm thành công',
    data: products
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