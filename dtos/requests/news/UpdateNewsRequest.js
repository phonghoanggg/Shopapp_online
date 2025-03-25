import Joi from 'joi';

class UpdateNewsRequest {
  constructor(data) {
    this.title = data.title ?? null;
    this.image = data.image ?? null;
    this.content = data.content ?? null;
  }

  // Validate dữ liệu đầu vào
  static validate(data) {
    const schema = Joi.object({
      title: Joi.string().allow(null, '').optional(),
      image: Joi.string().allow(null, '').optional(),
      content: Joi.string().allow(null, '').optional(),
    });

    return schema.validate(data);
  }
}

export default UpdateNewsRequest;
