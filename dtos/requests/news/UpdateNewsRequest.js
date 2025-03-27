import Joi from 'joi';

class UpdateNewsRequest {
  constructor(data) {
    this.title = data.title;
    this.image = data.image;
    this.content = data.content;
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
