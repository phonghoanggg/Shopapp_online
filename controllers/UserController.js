import { Sequelize } from "sequelize"
import {Op} from "sequelize"
import db from '../models'
import ResponeUser from "../dtos/respones/ResponeUser";
import argon2 from 'argon2'
export async function insertUser(req, res) {
  const { email } = req.body;
  // Check if email already exists
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({
      message: 'Email đã tồn tại'
    });
  }
  const hashedPassword = await argon2.hash(req.body.password)
  const user = await db.User.create({...req.body,password: hashedPassword});
  res.status(201).json({
    message: 'Thêm mới người dùng thành công',
    data: new ResponeUser(user)
  });
}