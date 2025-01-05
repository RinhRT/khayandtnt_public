const OTP = require('../models/otp')

const authentication_otp = {
    generate_otp: async (email) => {
        let otpCode = ''
        for (let i=0; i<6; i++) {
            otpCode += Math.floor(Math.random() * 10)
        }
    
        try {
            const expiresAt = new Date(Date.now() + 1 * 60 * 1000)
            const opts = new OTP({ email: email, expiresAt, code: otpCode })
            await opts.save()
    
            return otpCode
        } catch(error) {
            throw new Error(error)
        }
    },

    author: async (reqData) => {
        try {
            const optCode = await OTP.findOne({ code: reqData })

            if (!optCode) return {
                status: 404,
                message: "Otp code not found",
                data: null
            }

            await OTP.findOneAndDelete({ _id: optCode._id })

            return {
                status: 200,
                message: "Otp code verify successfully",
            }
        } catch(error) {
            throw new Error(error)
        }
    }
}

module.exports = authentication_otp
