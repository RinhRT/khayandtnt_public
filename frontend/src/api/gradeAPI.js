import { gradeStart, gradeFail, gradeSuccess } from '../store/gradeSlice';
import axiosInstance from './axiosInstance';

export const getClass = async (dispatch) => {
    dispatch(gradeStart()); // Gọi action gradeStart

    try {
        const res = await axiosInstance.get('grades', {});
        dispatch(gradeSuccess(res.data)); // Dispatch dữ liệu khi thành công
        return res.data
    } catch (error) {
        dispatch(gradeFail())
    }
};

export const getStudentByClass = async (data, dispatch) => {
    try {
        const res = await axiosInstance.post('user', {
            grade: data._id
        });

        return res.data
    } catch (error) {
        dispatch(gradeFail())
        return error
    }
}