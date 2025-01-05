const env = require('../configs/environment')
const jwt = require('jsonwebtoken')
const JWT = require('../middlewares/generate_jwt')
const rfToken = require('../models/refreshToken')
const Users = require('../models/user')

const refreshToken = async (req, res, next) => {
    try {
        const refreshTokenFromCookie = req.cookies.refreshToken;
        if (!refreshTokenFromCookie) {
            return res.status(403).json({ message: 'You\'re not authorized' });
        }
        
        // Xác thực refresh token
        jwt.verify(refreshTokenFromCookie, env.REFRESH_TOKEN, async (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: 'Token invalid' });
            }

            // Lấy thông tin người dùng từ DB
            const user = await Users.findById(decoded._id);
            if (!user) {
                return res.status(403).json({ message: 'User not found' });
            }
            const refreshTokens = await rfToken.find({ idUser: user._id })

            let result = false
            for (let data of refreshTokens) {
                if(data.token === refreshTokenFromCookie) {
                    result = true
                    break
                }
            }

            if(!result) {
                return res.status(403).json({ message: 'Refresh token invalid' });
            }

            // Xóa refresh token cũ trong DB trước khi tạo và lưu token mới
            await rfToken.findOneAndDelete({ token: refreshTokenFromCookie });

            const age = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);// 2 ngày

            // Tạo token mới
            const newAccessToken = JWT.generate_accessToken(user);
            const newRefreshToken = JWT.generate_refreshToken(user);

            // Lưu refresh token mới vào DB
            const newRfToken = new rfToken({
                token: newRefreshToken,
                idUser: user._id,
                expiresAt: age 
            });
            await newRfToken.save();  // Lưu vào DB

            // Set cookie với refresh token mới
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                secure: env.MODE_ENV === "production", 
                maxAge: age
            });

            // Trả về access token mới
            return res.status(200).json({
                accessToken: newAccessToken
            });
        });
    } catch (error) {
        next(error); // Đảm bảo rằng lỗi sẽ được xử lý đúng cách
    }
};


module.exports = refreshToken