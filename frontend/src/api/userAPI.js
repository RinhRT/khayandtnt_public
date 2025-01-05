import { loginFail, loginStart, loginSuccess } from '../store/authSlice'
import axiosInstance from './axiosInstance'

export const logging = async (data, dispatch, navigate) => {
    dispatch(loginStart())

    try {
        const user = await axiosInstance.post('/user/login', data)
        return user
    } catch (error) {
        dispatch(loginFail())
        return error
    }
}

export const checkOTP = async (data, dispatch, navigate, user) => {

    try {
        const res = await axiosInstance.post('/optcode', { code: data.code }, {
            headers: {
                'Authorization': `Bearer ${data.accessToken}`
            }
        })

        if (user) dispatch(loginSuccess(user))
        if (navigate) navigate('/')

        return res.data
    } catch (error) {
        dispatch(loginFail())
        return error
    }
}

export const getUser = async (data) => {
    try {
        const res = await axiosInstance.post(`/user/${data.path}`, data)
        return res.data
    } catch(error) {
        return error
    }
}

export const getAllUser = async () => {
    try {
        const res = await axiosInstance.get(`/user/status-tray`)
        return res.data
    } catch(error) {
        return error
    }
}

export const updateUser = async (data) => {
    try {
        const res = await axiosInstance.patch(`/user/${data.path}`, data)
        return res.data
    } catch(error) {
        return error
    }
}

export const deleteUser = async (data) => {
    try {
        const res = await axiosInstance.post(`/user/delete`, data)
        return res.data
    } catch(error) {
        return error
    }
}