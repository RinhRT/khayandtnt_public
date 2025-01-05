const env = require("../configs/environment");
const userService = require("../services/users");
const workXLSX = require("../utils/data_xlsx");
const JWT = require("../middlewares/generate_jwt");
const { generate_otp } = require("../services/generate_otp");
const OTPCode = require("../models/otp");
const sendMail = require("../utils/send_email");
const rfToken = require("../models/refreshToken");

const userCtr = {
    // Tạo người dùng mới
    register: async (req, res, next) => {
        try {
            let usersInfo = [];

            // Xử lý file nếu có
            if (req.files) {
                const userPromises = req.files.map(async (file) => {
                    const fileData = workXLSX.read_data(file);
                    return await userService.addNew(fileData);
                });

                const result = await Promise.all(userPromises);
                usersInfo = result.flat();
            } else {
                // Xử lý từ body nếu không có file
                usersInfo = await userService.addNew([req.body]);
            }

            return res.status(201).json({
                status: 200,
                message: 'Register success',
                data: usersInfo,
            });
        } catch (error) {
            next(error);
        }
    },

    // Xóa người dùng
    delete: async (req, res, next) => {
        try {
            const data = await userService.find_user(req.body);
            const dataToDelete = Array.isArray(data.data) ? data.data : [data.data];
            await userService.delete(dataToDelete);

            return res.status(200).json({
                status: 200,
                message: 'Delete users success',
            });
        } catch (error) {
            next(error);
        }
    },

    // Đăng nhập
    login: async (req, res, next) => {
        try {
            const datas = await userService.login(req.body);
            let accessToken = null;
            let refreshToken = null;

            if (datas.data) {
                const otp = await generate_otp(datas.data.email);
                sendMail({
                    email: datas.data.email,
                    title: 'Xác thực tài khoản',
                    subject: 'Xác thực mã otp của bạn',
                    desc: 'Để xác thực tài khoản của bạn, vui lòng sử dụng mã OTP bên dưới',
                    otp: otp,
                });

                accessToken = JWT.generate_accessToken({ _id: datas.data._id, level: datas.data.level });
                refreshToken = JWT.generate_refreshToken({ _id: datas.data._id, level: datas.data.level });

                const age = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

                const rf_token = new rfToken({ token: refreshToken, idUser: datas.data._id, expiresAt: age });
                await rf_token.save();

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/',
                    secure: env.MODE_ENV === "production",
                    maxAge: age,
                });
            }

            return res.status(datas.status).json({
                status: datas.status,
                message: datas.message,
                data: datas.data,
                accessToken: accessToken,
            });
        } catch (error) {
            next(error);
        }
    },

    // Cập nhật người dùng
    update: async (req, res, next) => {
        try {
            const data = await userService.find_user_by_email(req.body);
            if (!data.data) {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found for reset password.',
                });
            }

            const user = await userService.update_user({ _id: data.data._id, ...req.body });
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: 'Cannot reset password because user not found.',
                });
            }

            return res.status(user.status).json({
                status: user.status,
                message: 'Update user success',
                data: user.data,
            });
        } catch (error) {
            next(error);
        }
    },

    // Tìm người dùng theo grade
    find: async (req, res, next) => {
        try {
            const data = await userService.find_user_by_grades(req.body);
            return res.status(data.status).json({
                status: data.status,
                message: data.message,
                data: data.data,
            });
        } catch (error) {
            next(error);
        }
    },

    // Tìm người dùng theo email
    find_by_email: async (req, res, next) => {
        try {
            const datas = await userService.find_user_by_email(req.body);
            let accessToken = null;

            if (datas.data) {
                const otp = await generate_otp(datas.data.email);
                sendMail({
                    email: datas.data.email,
                    title: 'Xác thực tài khoản',
                    subject: 'Xác thực mã otp của bạn',
                    desc: 'Để xác thực tài khoản của bạn, vui lòng sử dụng mã OTP bên dưới',
                    otp: otp,
                });

                accessToken = JWT.generate_accessToken(datas.data);
            }

            return res.status(datas.status).json({
                status: datas.status,
                message: datas.message,
                data: datas.data,
                accessToken: accessToken,
            });
        } catch (error) {
            next(error);
        }
    },

    getStatusTray: async (req, res, next) => {
        try {
            const datas = await userService.getUserStatusCount();

            return res.status(datas.status).json({
                status: datas.status,
                message: datas.message,
                data: datas.data
            });
        } catch (error) {
            next(error);
        }
    },

    getAll: async (req, res, next) => {
        try {
            const datas = await userService.find_user();

            return res.status(datas.status).json({
                status: datas.status,
                message: datas.message,
                data: datas.data
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userCtr;
