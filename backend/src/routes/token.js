const refreshToken = require('../controllers/tokenRefresh')
const Router = require('express').Router()

Router.get('/', refreshToken)

module.exports = Router