const { StatusCodes } = require('http-status-codes')
const env = require('../configs/environment') // Import biên môi trường
const sendMail = require('../utils/send_email.js') // Import hàm gửi email

const errorHandlingMiddleware = (err, req, res, next) => {
  // Nếu lỗi không được gán statusCode thì mặc định là StatusCodes.INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], 
    stack: err.stack
  }

  // Gửi thông báo qua email khi BUILD_MODE là production
  if (env.BUILD_MODE === 'production') {
    const errorDetails = `
      Message: ${err.message || 'No message available'}
      Status Code: ${err.statusCode}
      Stack Trace: ${err.stack || 'No stack trace available'}
    `;
  
    // Gửi email thông báo lỗi cho admin (bạn)
    sendMail({
      email: env.MAIL_USER, // Email của bạn
      title: 'Thông báo lỗi hệ thống',
      subject: 'Lỗi ứng dụng',
      desc: `Có một lỗi xảy ra trong ứng dụng của bạn. Dưới đây là chi tiết lỗi:`,
      otp: errorDetails, // Chuyển thông tin lỗi vào phần otp
    });
  }

  // Nếu chế độ khác 'develop' thì stack sẽ được xoá
  if (env.BUILD_MODE !== 'develop') delete responseError.stack

  res.status(responseError.statusCode).json(responseError)
}

module.exports = {
  errorHandlingMiddleware
}
