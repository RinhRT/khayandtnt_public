const Router = require('express').Router()
const { check_File_XLSX_Validation } = require('../validations/checkFile')
const upload = require('../configs/upload')
const gradeCtr = require('../controllers/gradeCtr')
const JWT = require('../middlewares/generate_jwt')
const levelCheck = require('../validations/levelAction')

Router.post('/upload', JWT.verifyTokenAccessToken, levelCheck.isManage, upload.array('file', 5), check_File_XLSX_Validation, gradeCtr.register)
Router.post('/register', JWT.verifyTokenAccessToken, levelCheck.isManage, gradeCtr.register)
Router.post('/delete', JWT.verifyTokenAccessToken, levelCheck.isManage, gradeCtr.delete)
Router.get('/', JWT.verifyTokenAccessToken, gradeCtr.find)

const gradeRouter = Router
module.exports= gradeRouter