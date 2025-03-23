import { Sequelize } from "sequelize";
import db from "../models";
import { Op } from "sequelize";

export async function getNews(req, res) {
  const { search = "", page = 1 } = req.query;
  const pageSize = 5;
  const offset = (page - 1) * pageSize;
  
  let whereClause = {};
  if (search.trim() !== "") {
    whereClause = {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ]
    };
  }

  const [news, totalNews] = await Promise.all([
    db.News.findAll({
      where: whereClause,
      limit: pageSize,
      offset: offset
    }),
    db.News.count({
      where: whereClause
    })
  ]);

  return res.status(200).json({
    message: "Lấy danh sách tin tức thành công",
    data: news,
    currentPage: parseInt(page, 10),
    totalPage: Math.ceil(totalNews / pageSize),
    totalNews
  });
}

export async function getNewsById(req, res) {
  const { id } = req.params;
  const news = await db.News.findByPk(id);
  if (!news) {
    return res.status(404).json({ message: "Tin tức không tồn tại" });
  }
  res.status(200).json({
    message: "Lấy thông tin tin tức thành công",
    data: news
  });
}

export async function insertNews(req, res) {
  const transaction = await db.sequelize.transaction();

  try {
    // Tạo bản ghi mới trong bảng News
    const newsArticle = await db.News.create(req.body, { transaction });

    // Xác thực product_ids nếu được cung cấp
    const productIds = req.body.product_ids;
    if (productIds && productIds.length) {
      // Lấy danh sách product_id hợp lệ từ DB
      const validProducts = await db.Product.findAll({
        where: { id: productIds },
        transaction
      });
      // Trích xuất danh sách ID hợp lệ
      const validProductIds = validProducts.map((product) => product.id);
      // Lọc các product_id không hợp lệ khỏi danh sách yêu cầu
      const filteredProductIds = productIds.filter((id) => validProductIds.includes(id));

      // Chèn vào bảng NewsDetail nếu có product_id hợp lệ
      if (filteredProductIds.length) {
        const newsDetailPromises = filteredProductIds.map((productId) =>
          db.NewsDetail.create({ product_id: productId, news_id: newsArticle.id }, { transaction })
        );
        await Promise.all(newsDetailPromises);
      }
    }
    // Commit transaction nếu không có lỗi
    await transaction.commit();

    res.status(201).json({
      message: "Thêm mới tin tức thành công",
      data: newsArticle
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    res.status(500).json({ message: "Lỗi khi thêm tin tức", error });
  }
}

export async function deleteNews(req, res) {
  const { id } = req.params;
  const deleted = await db.News.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ message: "Tin tức không tồn tại" });
  }
  res.status(200).json({ message: "Xóa tin tức thành công" });
}

export async function updateNews(req, res) {
  const { id } = req.params;
  const [updated] = await db.News.update(req.body, { where: { id } });
  if (!updated) {
    return res.status(404).json({ message: "Tin tức không tồn tại" });
  }
  const updatedNews = await db.News.findByPk(id);
  res.status(200).json({
    message: "Cập nhật tin tức thành công",
    data: updatedNews
  });
}
