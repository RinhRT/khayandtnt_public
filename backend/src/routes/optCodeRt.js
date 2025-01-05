const Router = require('express').Router()
const JWT = require('../middlewares/generate_jwt')
const OptCodeCtr = require('../controllers/optCtr')

Router.get('/', JWT.verifyTokenAccessToken, OptCodeCtr.getOtp)
Router.post('/', JWT.verifyTokenAccessToken, OptCodeCtr.validationOTP)

module.exports = Router