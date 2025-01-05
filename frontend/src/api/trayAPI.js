import axiosInstance from "./axiosInstance"
import { 
    getTrayFail, 
    getTraySuccess, 
    getTrayStart
} from '../store/traySlice'

export const addTray = async (data, dispatch) => {
    dispatch(getTrayStart())

    try {
        const res = await axiosInstance.post('/trays/register', data)
        dispatch(getTraySuccess(res.data))
        return res.data
    } catch(error) {
        dispatch(getTrayFail(error))
        return error
    }
}

export const getTray = async (dispatch) => {
    dispatch(getTrayStart())

    try {
        const res = await axiosInstance.get('/trays')
        dispatch(getTraySuccess(res.data))
        return res.data
    } catch(error) {
        dispatch(getTrayFail())
    }
}

export const getTrayByUser = async (data, dispatch) => {
    dispatch(getTrayStart())

    try {
        const res = await axiosInstance.patch('/qrdata/verify-qr', data)
        dispatch(getTraySuccess(res.data))
        return res.data
    } catch(error) {
        dispatch(getTrayFail())
        return error.response.data
    }
}

export const getAllTrayStatus = async () => {
    try {
        const res = await axiosInstance.get('/trays')
        return res.data
    } catch(error) {
        return error
    }
}

export const updateTray = async (data) => {
    try {
        const res = await axiosInstance.patch(`/trays/update`, data)
        return res.data
    } catch(error) {
        return error
    }
}

export const deleteTray = async (data) => {
    try {
        const res = await axiosInstance.post(`/trays/delete`, {...data})
        return res.data
    } catch(error) {
        return error
    }
}