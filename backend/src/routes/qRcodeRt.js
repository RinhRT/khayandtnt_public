const Router = require('express').Router()
const qrCodeController = require('../controllers/qr_code_controller')
const JWT = require('../middlewares/generate_jwt')

Router.patch('/verify-qr', JWT.verifyTokenAccessToken, qrCodeController.check_qr)

const qrRouter = Router
module.exports = qrRouter