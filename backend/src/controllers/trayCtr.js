const trayService = require("../services/trays")
const userService = require("../services/users")
const workXLSX = require("../utils/data_xlsx")

const trayCtr = {
    upload_File_Register: async (req, res, next) => {
        try {
            let infoTray = []
            let trays = req.files.map(async (file) => {
                const data = workXLSX.read_data(file)
                return await trayService.addNew(data)
            })

            const result = await Promise.all(trays)
            infoTray = result.flat()

            res.status(201).json({
                status: 201,
                message: 'Upload tray success',
                data: infoTray
            })
        } catch (error) {
            next(error)
        }
    },

    register: async (req, res, next) => {
        try {
            let data = req.body
            let infoTray = await trayService.addNew([data])

            res.status(201).json({
                status: 201,
                message: 'Upload tray success',
                data: infoTray
            })
        } catch (error) {
            next(error)
        }
    },

    delete: async (req, res, next) =>  {
        try {
            const data = await trayService.find_tray(req.body)
            const dataToDelete = Array.isArray(data) ? data : [data];
            await trayService.delete(dataToDelete)

            res.status(200).json({
                message: 'Delete tray success',
                data: null
            })
        } catch (error) {
            next(error)
        }
    },

    find: async (req, res, next) =>  {
        try {
            const data = await trayService.find_tray(req.body)

            res.status(200).json({
                message: 'Find tray success',
                data: data
            })
        } catch (error) {
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const data = await trayService.update(req.body)
            await userService.update_user({_id: data.userID, status: 'returned'})

            res.status(200).json({
                status: 200,
                message: 'Update tray success',
                data: data
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = trayCtr