const jwt = require('jsonwebtoken') // Import thư viện JWT
const env = require('../configs/environment') // Import biến môi trường

// jwt dùng để tạo mã xác thực cho người dùng
const JWT = {
    // Tạo Access Token có thời hạn 15 phút
    generate_accessToken: (data) => {
        return jwt.sign({ _id: data._id, level: data.level }, env.ACCESS_TOKEN, { expiresIn: '15m' })
    },

    // Tạo Refresh Token có thời hạn 2 ngày
    generate_refreshToken: (data) => {
        return jwt.sign({ _id: data._id, level: data.level }, env.REFRESH_TOKEN, { expiresIn: '2d' })
    },

    // Middleware xác thực Access Token
    verifyTokenAccessToken: (req, res, next) => {
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Lấy token từ header
        
        if (!token) {
            return res.status(403).json({ message: 'Token invalid' }) // Token không tồn tại
        }
    
        jwt.verify(token, env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Verify token fail' }) // Token không hợp lệ
            }

            req.user = decoded; // Gắn thông tin user vào request
            next(); // Chuyển đến middleware tiếp theo
        })
    }
}

module.exports = JWT // Xuất module
