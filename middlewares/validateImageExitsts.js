import path from 'path';
import fs from 'fs';

const validateImageExitsts = (req, res, next) => {
  const imageName = req.body.image;

  // Chỉ kiểm tra nếu imageName có giá trị và không phải URL
  if (imageName && !imageName.startsWith('http://') && !imageName.startsWith('https://')) {
    const imagePath = path.join(__dirname, '../uploads/', imageName);

    // Kiểm tra xem file ảnh có tồn tại không
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        message: 'File ảnh không tồn tại'
      });
    }
  }

  // Nếu imageName rỗng, là URL hoặc file tồn tại, tiếp tục middleware tiếp theo
  next();
};

export default validateImageExitsts;
