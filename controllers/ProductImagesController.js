import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from "sequelize";

export async function getProductImages(req, res) {
  const { product_id, page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  let whereClause = {};
  if (product_id) {
    whereClause.product_id = product_id;
  }

  const [images, totalImages] = await Promise.all([
    db.ProductImage.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      // include:[{model: db.Product , as: 'Product'}]
    }),
    db.ProductImage.count({
      where: whereClause,
    }),
  ]);

  return res.status(200).json({
    message: "Lấy danh sách hình ảnh sản phẩm thành công",
    data: images,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalImages / pageSize),
    totalImages,
  });
}

export async function getProductImageById(req, res) {
  const { id } = req.params;
  const image = await db.ProductImage.findByPk(id);
  if (!image) {
    return res.status(404).json({ message: "Hình ảnh không tồn tại" });
  }
  res.status(200).json({
    message: "Lấy thông tin hình ảnh thành công",
    data: image,
  });
}

export async function insertProductImage(req, res) {
  const { product_id, image_url } = req.body;
  if (!product_id || !image_url) {
    return res.status(400).json({ message: "Thiếu thông tin product_id hoặc image_url" });
  }
  // Kiểm tra product_id có tồn tại hay không
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
  // Kiểm tra cặp product_id và image_url đã tồn tại hay chưa
  const existedImage = await db.ProductImage.findOne({
    where: { product_id, image_url }
  });
  if (existedImage) {
    return res.status(400).json({ message: "Hình ảnh sản phẩm đã tồn tại" });
  }

  const image = await db.ProductImage.create({ product_id, image_url });
  res.status(201).json({
    message: "Thêm hình ảnh sản phẩm thành công",
    data: image,
  });
}

export async function deleteProductImage(req, res) {
  const { id } = req.params;
  const deleted = await db.ProductImage.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: "Hình ảnh không tồn tại" });
  }
  res.status(200).json({ message: "Xóa hình ảnh thành công" });
}
