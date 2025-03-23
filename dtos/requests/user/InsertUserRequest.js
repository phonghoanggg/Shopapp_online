import Joi from 'joi';

class InsertUserRequest {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = data.role;
    this.avatar = data.avatar;
    this.phone = data.phone;
  }
  // Validate dữ liệu đầu vào
  static validate(data) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().optional().allow(''),
      role: Joi.number().integer().min(1).required(),
      avatar: Joi.string().optional().allow(''),
      phone: Joi.string().optional().allow('')
    });

    return schema.validate(data);
  }
}

export default InsertUserRequest;
