// Đây là một đối tượng kiểm tra level người dùng
const levelCheck = {
    isAdmin: (req, res, next) => {
        const user = req.user

        // Admin sẽ có level 0
        if (user.level !== 0) return res.status(403).json({
            message: "You're cannot access to this page. Please try again.",
            status: 403
        })
        
        next()
    },

    isManage: (req, res, next) => {
        const user = req.user

        // Manage sẽ có level là 1
        if (user.level > 1) return res.status(403).json({
            message: "You're cannot access to this page. Please try again.",
            status: 403
        })
        
        next()
    },
}

module.exports = levelCheck
