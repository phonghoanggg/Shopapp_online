import path from 'path';
import fs from "fs"
import db from '../models';

export async function uploadImages(req, res) {
  // Kiểm tra nếu không có file nào được tải lên
  if (!req.files || req.files.length === 0) {
    throw new Error('Không có file nào được tải lên');
  }

  // Trả về đường dẫn của các file ảnh được tải lên
  const uploadedImagesPaths = req.files.map(file => path.basename(file.path));

  res.status(201).json({
    message: 'Tải ảnh lên thành công',
    files: uploadedImagesPaths
  });
}
export async function viewImage(req, res) {
  const { fileName } = req.params;
  const imagePath = path.join( path.join(__dirname, '../uploads/'), fileName);

  // Kiểm tra xem file có tồn tại không
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Nếu file không tồn tại, trả về lỗi 404
      return res.status(404).send('Image not found');
    }
    // Nếu file tồn tại, gửi nó về làm phản hồi
    res.sendFile(imagePath);
  });
}

export async function deleteImages(req, res) {
  const { id } = req.params;

  // Tìm ảnh trong database
  const image = await db.ProductImage.findByPk(id);
  if (!image) {
    return res.status(404).json({ message: 'Hình ảnh không tồn tại' });
  }

  // Xây dựng đường dẫn file ảnh từ image_url
  const imagePath = path.join(__dirname, '../uploads/', path.basename(image.image_url));
  
  try { 
    // Kiểm tra và xóa file ảnh nếu tồn tại
    await fs.access(imagePath); // Kiểm tra xem file có tồn tại không
    await fs.unlink(imagePath); // Xóa file ảnh
  } catch (error) {
    console.warn(`Không tìm thấy hoặc không thể xóa file: ${imagePath}`);
  }

  // Xóa bản ghi trong bảng ProductImage
  await db.ProductImage.destroy({ where: { id } });

  res.status(200).json({ message: 'Xóa hình ảnh thành công' });
}