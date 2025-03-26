import Joi from 'joi';

class InsertBannerRequest {
  constructor(data) {
    this.name = data.name;
    this.image = data.image;
    this.status = data.status;
  }

  // Validate dữ liệu đầu vào
  static validate(data) {
    const schema = Joi.object({
      name: Joi.string().required(),
      image: Joi.string().optional().allow(''),
      status: Joi.number().integer().min(1).required() // Đảm bảo status > 0
    });

    return schema.validate(data);
  }
}

export default InsertBannerRequest;
