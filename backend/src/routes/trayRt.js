const { check_File_XLSX_Validation } = require('../validations/checkFile')
const upload = require('../configs/upload')
const trayCtr = require('../controllers/trayCtr')
const JWT = require('../middlewares/generate_jwt')
const levelCheck = require('../validations/levelAction')
const Router = require('express').Router()

Router.get('/', JWT.verifyTokenAccessToken, trayCtr.find)
Router.post('/find-tray', JWT.verifyTokenAccessToken, trayCtr.find)
Router.post('/register-file', JWT.verifyTokenAccessToken, levelCheck.isManage, upload.array('file', 5), check_File_XLSX_Validation, trayCtr.upload_File_Register)
Router.post('/register', JWT.verifyTokenAccessToken, levelCheck.isManage, trayCtr.register)
Router.post('/delete', JWT.verifyTokenAccessToken, levelCheck.isManage, trayCtr.delete)
Router.patch('/update', JWT.verifyTokenAccessToken, levelCheck.isManage, trayCtr.update)

const trayRouter = Router
module.exports = trayRouter