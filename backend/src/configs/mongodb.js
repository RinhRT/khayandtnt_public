const mongoose = require('mongoose') // Import Mongoose
const env = require('./environment') // Import biến môi trường

const CONNECT_DB = async () => {
    try {
        mongoose.set('strictQuery', false) // Tắt cảnh báo `strictQuery`
        
        await mongoose.connect(env.MONGO_URL, {
            dbName: env.DATABASE, // Tên database
            useNewUrlParser: true, // Hỗ trợ URL mới
            useUnifiedTopology: true // Tối ưu kết nối
        })

        console.log('Connected to MongoDB') // Kết nối thành công
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message) // Báo lỗi kết nối
        process.exit(1) // Thoát chương trình
    }
}

module.exports = { CONNECT_DB } // Xuất hàm kết nối
