const validate = (requestType) =>  {
  return (req, res, next) => {
    // bắt lỗi phía user request
    const {error} = requestType.validate(req.body)
    if(error) {
      return res.status(400).json({
        message: "Lỗi khi thêm sản phẩm mới",
        errors: error.details[0]?.message
      })
    }
    next()
  }
}
export default validate