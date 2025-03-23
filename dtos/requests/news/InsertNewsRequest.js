import Joi from 'joi';

class InsertNewsRequest {
  constructor(data) {
    this.title = data.title;
    this.image = data.image;
    this.content = data.content;
    this.product_ids = data.product_ids;
  }

  // Validate dữ liệu đầu vào
  static validate(data) {
    const schema = Joi.object({
      title: Joi.string().required(),
      image: Joi.string().optional().allow(''),
      content: Joi.string().required(),
      product_ids: Joi.array().items(Joi.number().integer()).optional()
    });

    return schema.validate(data);
  }
}

export default InsertNewsRequest;
