const multer = require('multer') // Import Multer để xử lý file upload

// Cấu hình lưu trữ cho Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/') // Thư mục lưu file
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // Tạo chuỗi duy nhất
        cb(null, file.originalname + '-' + uniqueSuffix) // Đặt tên file
    }
})

// Tạo middleware upload
const upload = multer({ storage: storage })

module.exports = upload // Xuất module
