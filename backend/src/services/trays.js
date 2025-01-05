const Trays = require('../models/tray')

const trayService = {
    addNew: async (reqData) => {
        try {
            const datas = reqData

            let info = []
            for (const value in datas) {
                let trayInfo = new Trays({ name: datas[value].name })
                await trayInfo.save()
                info.push(trayInfo)
            }

            return info
        } catch(error) {
            throw Error(error.message, error.options)
        }
    },

    find_tray: async (reqData) => {
        try {
            let data;
            if (reqData._id) {
              data = await Trays.findById(reqData._id)
                .populate('userID', 'name') 
                .populate('gradeID', 'name'); 
            } else {
              data = await Trays.find({})
                .populate('userID', 'name') 
                .populate('gradeID', 'name'); 
            }
            return data;
        } catch (error) {
            throw new Error(error.message, error.options);
        }
    },

    delete: async (reqData) => {
        try {
            const data = reqData.forEach(async dataID => await Trays.deleteOne({_id: dataID._id})) 
        } catch(error) {
            throw Error(error.message, error.options)
        }
    },

    update: async (reqData) => {
        try {
            let update = {
                userID: reqData?.userID === null ? null : reqData?.userID, 
                gradeID: reqData?.gradeID === null ? null : reqData?.gradeID,
                status: reqData.status ? true : false
            }
            const data = await Trays.findByIdAndUpdate(reqData._id, { userID: reqData?.userID, gradeID: reqData?.gradeID, status: reqData.status })

            return data
        } catch(error) {
            throw Error(error.message, error.options)
        }
    }
}

module.exports = trayService