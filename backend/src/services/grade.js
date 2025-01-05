const Grades = require('../models/grade')
const Users = require('../models/user')

const gradeService = {
    addNew: async (reqData) => {
        try {
            const datas = reqData

            let info = []
            for (const data in datas) {
                let ollGrade = await Grades.findOne({name: datas[data].name})
                
                if (!ollGrade) {
                    let gradeInfo = new Grades({ name: datas[data].name })
                    await gradeInfo.save()
                    info.push(gradeInfo)
                }
            }

            return info
        } catch(error) {
            throw Error(error.message, error.options)
        }
    },

    find_grade: async (reqData) => {
        try {
            const data = reqData.name ? await Grades.find({ name: reqData.name }): await Grades.find({})
            return data
        } catch(error) {
            throw Error(error.message, error.options)
        }
    },

    find_grade_by_id_user: async (reqData) => {
        try {
            if (!reqData) return null

            const data = await Grades.findById(reqData._id)
            return data
        } catch(error) {
            throw Error(error.message, error.options)
        }
    },

    delete: async (reqData) => {
        try {
            //reqData is array
            reqData.forEach(async data => {
                await Users.deleteMany({ _id: { $in: data.students } })
                await Grades.deleteOne({ _id: data._id })
            })
        } catch(error) {
            throw Error(error.message, error.options)
        }
    }
}

module.exports = gradeService