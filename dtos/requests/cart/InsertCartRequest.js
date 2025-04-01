import Joi from 'joi';

class InsertCartRequest {
  constructor(data) {
    this.user_id = data.user_id;
    this.session_id = data.session_id;
  }

  // Validate dữ liệu đầu vào
  static validate(data) {
    const schema = Joi.object({
      user_id: Joi.number().integer().optional(),
      session_id: Joi.string().required()
    });

    return schema.validate(data);
  }
}

export default InsertCartRequest;