import Joi from 'joi';
import { UserRole } from '../../../constants';

class InsertUserRequest {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.avatar = data.avatar;
    this.phone = data.phone;
  }
  // Validate dữ liệu đầu vào
  static validate(data) {
    const schema = Joi.object({
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(),
      name: Joi.string().optional().allow(''),
      avatar: Joi.string().uri().optional(),
      phone: Joi.string().optional().allow('')
    });

    return schema.validate(data);
  }
}

export default InsertUserRequest;
