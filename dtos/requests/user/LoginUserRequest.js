import Joi from 'joi';

class LoginUserRequest {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
  }
  // Validate dữ liệu đầu vào
  static validate(data) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      phone: Joi.string().optional().allow('')
    });

    return schema.validate(data);
  }
}

export default LoginUserRequest;
