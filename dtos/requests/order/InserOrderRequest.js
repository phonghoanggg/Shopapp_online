import Joi from 'joi';

class InsertOrderRequest {
  constructor(data) {
    this.user_id = data.user_id;
    this.status = data.status;
    this.note = data.note;
    this.total = data.total;
    this.phone = data.phone;
    this.address = data.address;
  }

  // validate thành công mới tạo ra đối tượng
  static validate(data) {
    const schema = Joi.object({
      user_id: Joi.number().integer().required(),
      status: Joi.number().integer().positive().min(1).required(),
      note: Joi.string().optional().allow(''),
      total: Joi.number().integer().min(0).required(),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(), // Số điện thoại từ 10 đến 15 số
      address: Joi.string().min(5).max(255).optional() // Địa chỉ từ 5 đến 255 ký tự
    });

    return schema.validate(data);
  }
}

export default InsertOrderRequest;
