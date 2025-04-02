import { Sequelize, Op } from "sequelize";
import db from '../models';
import argon2 from 'argon2';
import ResponeUser from "../dtos/respones/ResponeUser";
import { UserRole } from "../constants";
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  const { email, phone, password,} = req.body;

  // Kiểm tra điều kiện: Cần ít nhất một trong hai thông tin email hoặc phone
  if (!email && !phone) {
    return res.status(400).json({
      message: 'Cần cung cấp ít nhất email hoặc số điện thoại'
    });
  }
  // Xây dựng điều kiện kiểm tra sự tồn tại
  const condition = {};
  if (email) condition.email = email;
  if (phone) condition.phone = phone;
  // Kiểm tra sự tồn tại của người dùng bằng email hoặc phone
  const existingUser = await db.User.findOne({ where: condition });
  if (existingUser) {
    return res.status(409).json({
      message: 'Email hoặc số điện thoại đã tồn tại'
    });
  }
  // Mã hóa mật khẩu nếu được cung cấp
  const hashedPassword = password ? await argon2.hash(password) : null;
  // Tạo người dùng mới
  const user = await db.User.create({
    ...req.body,
    email,
    phone,
    role: UserRole.USER,
    password: hashedPassword,
  });

  // Phản hồi thành công
  return res.status(201).json({
    message: 'Đăng ký tài khoản thành công',
    data: new ResponeUser(user) // Format thông tin người dùng
  });
};

export const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;

  // Kiểm tra điều kiện: Cần ít nhất một trong hai thông tin email hoặc phone
  if (!email && !phone) {
    return res.status(400).json({
      message: 'Cần cung cấp ít nhất email hoặc số điện thoại'
    });
  }

  // Xây dựng điều kiện tìm kiếm người dùng
  const condition = {};
  if (email) condition.email = email;
  if (phone) condition.phone = phone;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await db.User.findOne({ where: condition });
    if (!user) {
      return res.status(404).json({
        message: 'Email hoặc số điện thoại không tồn tại'
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Tên hoặc mật khẩu không chính xác'
      });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        // role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION}
    )

    // Nếu đăng nhập thành công, trả về thông tin người dùng
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      data: new ResponeUser(user),
      token
    });
  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi đăng nhập',
      error: error.message
    });
  }
};
