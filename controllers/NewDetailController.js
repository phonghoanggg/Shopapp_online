import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from "sequelize";

export const getNewsDetails = async (req, res) => {
  const { page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  const [newsDetails, totalNewsDetails] = await Promise.all([
    db.NewsDetail.findAll({
      limit: pageSize,
      offset: offset,
      // include: [{ model: db.News }, { model: db.Product }],
    }),
    db.NewsDetail.count(),
  ]);

  return res.status(200).json({
    message: "Lấy danh sách chi tiết tin tức thành công",
    data: newsDetails,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(totalNewsDetails / pageSize),
    totalNewsDetails,
  });
};

export const getNewsDetailById = async (req, res) => {
  const { id } = req.params;
  const newsDetail = await db.NewsDetail.findByPk(id, {
    include: [{ model: db.News }, { model: db.Product }],
  });
  if(!newsDetail) {
    return res.status(404).json({ message: "Chi tiết tin tức không tồn tại" });
  }
  res.status(200).json({
    message: "Lấy thông tin chi tiết tin tức thành công",
    data: newsDetail,
  });
};

export const insertNewsDetail = async (req, res) => {
  const { news_id, product_id } = req.body;
  // Kiểm tra xem news_id và product_id có tồn tại không
  const news = await db.News.findByPk(news_id);
  if (!news) {
    return res.status(404).json({ message: "Tin tức không tồn tại" });
  }
  const product = await db.Product.findByPk(product_id);
  if (!product) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại" });
  }
  // Check có bị trùng không
  const duplicateExitsts = await db.NewsDetail.findOne({ where: { news_id, product_id } });
  if (duplicateExitsts) {
    return res.status(409).json({ message: "Chi tiết tin tức đã tồn tại" });
  }
  const newsDetail = await db.NewsDetail.create({ news_id, product_id });
  res.status(201).json({
    message: "Thêm mới chi tiết tin tức thành công",
    data: newsDetail,
  });
};

export const deleteNewsDetail = async (req, res) => {
  const { id } = req.params;
  const deleted = await db.NewsDetail.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: "Chi tiết tin tức không tồn tại" });
  }
  res.status(200).json({ message: "Xóa chi tiết tin tức thành công" });
};

export const updateNewsDetail = async (req, res) => {
  const { id } = req.params;
  const { news_id, product_id } = req.body;
  //  Kiểm tra xem có bị duplicate không
  const duplicateExitsts = await db.NewsDetail.findOne({ 
    where: {
       news_id, 
       product_id, 
       id: { [Op.ne]: id }
    } 
  });
  if (duplicateExitsts) {
    return res.status(409).json({ message: "Mỗi quan hệ giữa sản phẩm và tin tức đã tồn tại trong bản ghi khác" });
  }
  const updatedNewsDetail = await db.NewsDetail.update({ news_id, product_id }, { where: { id } });
  if (!updatedNewsDetail[0]) {
    return res.status(404).json({ message: "Chi tiết tin tức không tồn tại" });
  } else {
    res.status(200).json({
      message: "Cập nhật chi tiết tin tức thành công",
    });
  }
};