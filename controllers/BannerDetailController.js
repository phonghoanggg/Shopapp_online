import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from "sequelize";

export const getBannerDetails = async (req, res) => {
  const bannerDetails = await db.BannerDetail.findAll();
  res.status(200).json({
    message: "Lấy danh sách chi tiết banner thành công",
    data: bannerDetails
  });
};

export const getBannerDetailById = async (req, res) => {
  const { id } = req.params;
  const bannerDetail = await db.BannerDetail.findByPk(id);
  if (!bannerDetail) {
    return res.status(404).json({
      message: "Chi tiết banner không tìm thấy"
    });
  }
  res.status(200).json({
    message: "Lấy thông tin chi tiết banner thành công",
    data: bannerDetail
  });
};

export const insertBannerDetail = async (req, res) => {
  const { banner_id, product_id } = req.body;

  // Kiểm tra banner_id có tồn tại không
  const bannerExists = await db.Banner.findByPk(banner_id);
  if (!bannerExists) {
    return res.status(400).json({ message: "Banner không tồn tại" });
  }

  // Kiểm tra product_id có tồn tại không
  const productExists = await db.Product.findByPk(product_id);
  if (!productExists) {
    return res.status(400).json({ message: "Sản phẩm không tồn tại" });
  }

  // Kiểm tra xem banner_id và product_id có bị trùng lặp không
  const existingDetail = await db.BannerDetail.findOne({
    where: { banner_id, product_id }
  });

  if (existingDetail) {
    return res.status(400).json({ message: "Chi tiết banner đã tồn tại" });
  }

  // Thêm chi tiết banner mới
  const bannerDetail = await db.BannerDetail.create({ banner_id, product_id });

  res.status(201).json({
    message: "Thêm chi tiết banner thành công",
    data: bannerDetail
  });
};


export const updateBannerDetail = async (req, res) => {
  const { id } = req.params;
  const { banner_id, product_id } = req.body;
  // Kiểm tra banner_id có tồn tại không
  const bannerExists = await db.Banner.findByPk(banner_id);
  if (!bannerExists) {
    return res.status(400).json({ message: "Banner không tồn tại" });
  }
  // Kiểm tra product_id có tồn tại không
  const productExists = await db.Product.findByPk(product_id);
  if (!productExists) {
    return res.status(400).json({ message: "Sản phẩm không tồn tại" });
  }
  // Kiểm tra duplicate
  const duplicateBannerDetail = await db.BannerDetail.findOne({
    where: { banner_id, product_id, id: { [Op.ne]: id } }
  });
  if (duplicateBannerDetail) {
    return res.status(409).json({ message: "Mối quan hệ giữa banner và sản phẩm đã tồn tại trong bảng ghi khác" });
  }
  const [updated] = await db.BannerDetail.update(
    { banner_id, product_id },
    { where: { id } }
  );
  if (!updated) {
    return res.status(404).json({
      message: "Chi tiết banner không tồn tại"
    });
  }
  const updatedBannerDetail = await db.BannerDetail.findByPk(id);
  res.status(200).json({
    message: "Cập nhật chi tiết banner thành công",
    data: updatedBannerDetail
  });
};

export const deleteBannerDetail = async (req, res) => {
  const { id } = req.params;
  const deleted = await db.BannerDetail.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({
      message: "Chi tiết banner không tồn tại"
    });
  }
  res.status(200).json({
    message: "Xóa chi tiết banner thành công"
  });
};
