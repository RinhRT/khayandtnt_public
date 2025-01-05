// Định nghĩa lớp lỗi tùy chỉnh kế thừa từ Error
class errAPI extends Error {
    constructor(statusCode, message) {
        super(message); // Gọi constructor của Error với thông báo lỗi
        this.statusCode = statusCode; // Gán mã trạng thái lỗi
        Error.captureStackTrace(this, this.constructor); // Ghi lại stack trace
    }
}

module.exports = errAPI; // Xuất lớp lỗi tùy chỉnh
