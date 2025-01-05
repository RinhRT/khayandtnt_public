const Joi = require('joi') // Import Joi để validate dữ liệu

// Cấu hình schema để validate dữ liệu
const schema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9@#$%^&*()!]{3,30}$')) // Regex cho password
        .min(6) // Tối thiểu 6 ký tự
        .required(), // Bắt buộc

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) // Email hợp lệ
        .min(5) // Tối thiểu 5 ký tự
        .required(), // Bắt buộc

    grade: Joi.string()
        .min(3) // Tối thiểu 3 ký tự
        .max(64) // Tối đa 64 ký tự
})

// Middleware validate dữ liệu login
const check_data_login = async (req, res, next) => {
    try {
        await schema.validateAsync({ email: req.body.email, password: req.body.password })
        next() // Dữ liệu hợp lệ, chuyển sang middleware tiếp theo
    } catch (error) {
        next(error) // Dữ liệu không hợp lệ, chuyển lỗi
    }
}

// Middleware validate dữ liệu đăng ký
const check_data_register = async (req, res, next) => {
    try {
        await schema.validateAsync({ email: req.body.email, password: req.body.password })
        next() // Dữ liệu hợp lệ, chuyển sang middleware tiếp theo
    } catch (error) {
        next(error) // Dữ liệu không hợp lệ, chuyển lỗi
    }
}

// Xuất module
module.exports = {
    check_data_login,
    check_data_register
}
