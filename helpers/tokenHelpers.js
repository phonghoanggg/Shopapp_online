import jwt from 'jsonwebtoken';
import db from '../models';

export const getUserFromToken = async (req, res) => {
  try {
    // Lấy token từ headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Không có token được cung cấp' });
    }

    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Trả về thông tin người dùng nếu hợp lệ
    return user;
  } catch (error) {
    // Xử lý lỗi nếu token không hợp lệ hoặc hết hạn
    res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn',
      error: error.message
    });
    return null; // Trả về null để biểu thị lỗi
  }
};
