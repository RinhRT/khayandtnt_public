const gradeService = require('../services/grade')
const workXLSX = require('../utils/data_xlsx')

const gradeCtr = {
    register: async (req, res, next) => {
        try {
            let grades = []
            if (req.files) {
                let grade = req.files.map(async (file) => {
                    const data = workXLSX.read_data(file)
                   await gradeService.addNew(data)
                })
                
                let result = await Promise.all(grade)
                grades = result.flat()
            } else {
                grades = await gradeService.addNew([req.body])            
            }

            res.status(201).json({
                message: 'Upload grade success',
                data: grades
            })
        } catch (error) {
            next(error)
        }
    },

    find: async (req, res, next) => {
        try {
            const grade = await gradeService.find_grade(req.body) 

            res.status(200).json({
                message: 'success',
                data: grade
            })
        } catch (error) {
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const data = await gradeService.find_grade(req.body)
            const dataToDelete = Array.isArray(data) ? data : [data];
            await gradeService.delete(dataToDelete) 

            res.status(200).json({
                message: 'Delete success',
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = gradeCtr