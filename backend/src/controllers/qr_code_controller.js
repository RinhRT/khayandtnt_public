const gradeService = require("../services/grade");
const trayService = require("../services/trays");
const userService = require("../services/users");

const qrCodeController = {
    check_qr: async (req, res, next) => {
        try {
            const reqUser = req.user;
            let data = null
            // Lấy thông tin người dùng hiện tại
            let userData = await userService.find_user(reqUser);
            if (!userData.data) {
                return res.status(403).json({
                    message: "Bạn chưa đăng nhập. Vui lòng thử lại.",
                });
            }

            let user = userData.data

            let dataTray = await trayService.find_tray(req.body);
            if(!dataTray) {
                return res.status(404).json({
                    status: 404,
                    message: "Mã QR không tồn tại...",
                });
            }

            if (user.level > 1 && user.status !== 'received' && !dataTray.status) {
                data = await trayService.update({ _id: dataTray._id, userID: user._id, gradeID: user.grade, status: true })
                await userService.update_user({_id: user._id, status: 'received'})
            } else if (user.level > 1 && user.status === 'received' && !dataTray.status) {
                return res.status(203).json({
                    status: 203,
                    message: "Bạn đã nhận khay trước đó"
                })
            } else if (user.level > 1 && dataTray.status) {
                return res.status(203).json({
                    status: 203,
                    message: "Hãy mang khay đến quản trị viên"
                }) 
            } else if (user.level < 2 && dataTray.status) {
                data = await trayService.update({ _id: dataTray._id, userID: null, gradeID: null, status: false })
                await userService.update_user({_id: dataTray.userID, status: 'returned'})
            } else if (user.level < 2 && !dataTray.status) {
                return res.status(203).json({
                    status: 203,
                    message: "Khay chưa được nhận"
                }) 
            }
            
            res.status(200).json({
                status: 200,
                message: "Lấy khay thành công.",
                data,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = qrCodeController;
