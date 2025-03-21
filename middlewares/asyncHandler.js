const asyncHandler = (fn) =>  {
  return async (req, res, next) => {
    // bắt lỗi phía server
    try {
      await fn(req,res,next)
    } catch(error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV = 'development' ? error : ""
      })
      next(error)
    }
  }
}
export default asyncHandler