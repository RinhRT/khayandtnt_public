const authentication_otp = require('../services/generate_otp')

const OptCodeCtr = {
    getOtp: async (req, res, next) => { 
        try {
            if (!req.user) return res.status(403).json({
                status: 404,
                message: 'You\'re not auth'
            })

            const user = await userService.find_user(req.user)
            if (!user) return res.status(403).json({
                status: 404,
                message: 'User not found'
            })

            const optCode = await authentication_otp.generate_otp(user.data.email)

            return res.status(200).json({
                status: 200,
                message: 'Get opt code successfully',
                data: optCode
            })
        } catch(error) {
            throw new Error(error)
        }
    },

    validationOTP: async (req, res, next) => {
        try {
            const { code } = req.body

            const optCode = await authentication_otp.author(code) 
            if (!optCode) return res.status(403).json({
                status: 403,
                message: 'Opt code invalid',
                data: null
            })

            return res.status(optCode.status).json({ ...optCode })
        } catch(error) {
            throw new Error(error)
        }
    }
}

module.exports = OptCodeCtr