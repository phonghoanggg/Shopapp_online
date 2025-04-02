import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from "sequelize";
import { BannerStatus } from "../constants";

export async function getBanners(req, res) {
  const { page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;

  const [banners, totalBanners] = await Promise.all([
    db.Banner.findAll({
      limit: pageSize,
      offset: offset
    }),
    db.Banner.count()
  ]);

  return res.status(200).json({
    message: "Lấy danh sách banner thành công",
    data: banners,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalBanners / pageSize),
    totalBanners
  });
}

export async function getBannerById(req, res) {
  const { id } = req.params;
  const banner = await db.Banner.findByPk(id);
  if (!banner) {
    return res.status(404).json({ message: "Banner không tồn tại" });
  }
  res.status(200).json({
    message: "Lấy thông tin banner thành công",
    data: banner
  });
}

export async function insertBanner(req, res) {
  const duplicateBanner = await db.Banner.findOne({where : {name: req.body.name.trim()}});
  if (duplicateBanner) {
    return res.status(409).json({ message: "Banner đã tồn tại, vui lòng chọn tên khác" });
  }
  const bannerData = {
    ...req.body,
    status: BannerStatus.ACTIVE
  }
  const newBanner = await db.Banner.create(bannerData);
  res.status(201).json({
    message: "Thêm mới banner thành công",
    data: newBanner
  });
}

export async function updateBanner(req, res) {
  const { id } = req.params;
  const [updated] = await db.Banner.update(req.body, { where: { id } });
  if (!updated) {
    return res.status(404).json({ message: "Banner không tồn tại" });
  }
  // Kiểm tra xem có banner nào khác có cùng tên không (trừ sản phẩm hiện tại)
  const bannerName = req.body.name.trim();
  const existingProduct = await db.Banner.findOne({
    where: {
      name: bannerName,
      id: { [Op.ne]: id } // Loại trừ sản phẩm hiện tại
    }
  });
  if (existingProduct) {
    return res.status(400).json({
      message: 'Tên banner đã tồn tại, vui lòng chọn tên khác.'
    });
  }
  const updatedBanner = await db.Banner.findByPk(id);
  res.status(200).json({
    message: "Cập nhật banner thành công",
    data: updatedBanner
  });
}

export const deleteBanner = async (req, res) => {
  const { id } = req.params;
  const deleted = await db.Banner.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: "Banner không tồn tại" });
  }
  res.status(200).json({ message: "Xóa banner thành công" });
};
