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

export const deleteNews = async (req, res) => {
  const { id } = req.params;
  const transaction = await db.sequelize.transaction(); // Start a transaction
  //  Khi 2 bảng có mối quan hệ 1- n, cần xóa bản ghi trong bảng con trước
  try {
    // First, delete any associated news details
    await db.NewsDetail.destroy({
      where: { news_id: id },
      transaction: transaction // Use the transaction
    });

    // Then, delete the news article itself
    const deleted = await db.News.destroy({
      where: { id },
      transaction: transaction // Use the transaction
    });

    if (deleted) {
      await transaction.commit(); // Commit the transaction if everything is fine
      return res.status(200).json({
        message: "Xóa bài báo thành công"
      });
    } else {
      await transaction.rollback(); // Rollback if the news article wasn’t found
      return res.status(404).json({
        message: "Bài báo không tồn tại"
      });
    }
  } catch (error) {
    await transaction.rollback(); // Rollback if there's an error
    return res.status(500).json({
      message: "Lỗi khi xóa bài báo",
      error: error.message
    });
  }
};

export async function updateNews(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  // Kiểm tra xem tin tức có tồn tại không
  const existingNews = await db.News.findByPk(id);
  if (!existingNews) {
    return res.status(404).json({ message: 'Tin tức không tồn tại' });
  }

  // Kiểm tra xem tiêu đề tin tức mới có bị trùng với tin khác không
  const duplicateNews = await db.News.findOne({
    where: { title, id: { [Op.ne]: id } }
  });

  if (duplicateNews) {
    return res.status(400).json({ message: 'Tiêu đề tin tức đã tồn tại, vui lòng chọn tiêu đề khác' });
  }

  // Cập nhật tin tức
  await db.News.update(req.body, { where: { id } });

  const updatedNews = await db.News.findByPk(id);
  res.status(200).json({
    message: 'Cập nhật tin tức thành công',
    data: updatedNews
  });
}