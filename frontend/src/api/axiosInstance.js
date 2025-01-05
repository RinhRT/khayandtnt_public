import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Giải mã JWT
import { store } from '../store/index'; // Import store để lấy Redux state
import { loginSuccess, logoutSuccess } from '../store/authSlice'; // Action để cập nhật token và đăng xuất

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/v1`, // Base URL của backend server
    withCredentials: true, // Gửi cookies và credentials
    headers: {
        "Content-Type": "application/json",
        'Pragma': 'no-cache',
    }
});

// Lưu trữ trạng thái của việc refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Hàm để làm mới token
const refreshToken = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/refresh-token`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

// Hàm để xử lý các subscriber chờ đợi việc làm mới token
const onRefreshTokenFetched = (accessToken) => {
    refreshSubscribers.forEach((callback) => callback(accessToken));
    refreshSubscribers = []; // Reset list
};

// Hàm đăng xuất và xóa dữ liệu xác thực
const clearAuthData = () => {
    localStorage.clear(); // Xóa toàn bộ localStorage
    document.cookie.split(";").forEach((c) => {
        document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
};

// Add Request Interceptor để gắn token vào header cho mỗi request
axiosInstance.interceptors.request.use(
    async (config) => {
        const state = store.getState();
        const user = state.auth?.user;

        // Không cần xử lý token cho trang đăng nhập
        if (window.location.pathname === '/login') {
            return config;
        }

        if (user && user.accessToken) {
            const decoded = jwtDecode(user.accessToken);

            // Kiểm tra xem token có hết hạn không
            if (decoded.exp < Date.now() / 1000) {
                // Nếu đang có yêu cầu làm mới token, đợi và tiếp tục các request tiếp theo
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const data = await refreshToken();
                        store.dispatch(loginSuccess({ ...user, accessToken: data.accessToken }));

                        // Thêm access token vào headers cho các request đang chờ
                        onRefreshTokenFetched(data.accessToken);

                        // Cập nhật accessToken trong header của request
                        config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    } catch (error) {
                        console.error("Error refreshing token:", error);

                        // Nếu xảy ra lỗi khi refresh token và không phải ở trang login
                        if (window.location.pathname !== '/login') {
                            clearAuthData();
                            store.dispatch(logoutSuccess());
                            window.location.href = '/login';
                        }
                        return Promise.reject(error);
                    } finally {
                        isRefreshing = false;
                    }
                } else {
                    // Nếu đang làm mới token, đăng ký một subscriber để cập nhật access token
                    return new Promise((resolve) => {
                        refreshSubscribers.push((accessToken) => {
                            config.headers['Authorization'] = `Bearer ${accessToken}`;
                            resolve(config);
                        });
                    });
                }
            } else {
                config.headers['Authorization'] = `Bearer ${user.accessToken}`;
            }
        }

        return config; // Trả về config đã được sửa đổi
    },
    (error) => {
        return Promise.reject(error); // Nếu có lỗi trong quá trình request, reject promise
    }
);

// Add Response Interceptor để xử lý các lỗi 40X và 50X
axiosInstance.interceptors.response.use(
    response => response, // Nếu response thành công, trả về nguyên vẹn
    (error) => {
        if (error.response && error.response.status === 403) {
            console.log("Access denied. Redirecting to login...");
            
            // Nếu lỗi 403 xảy ra và không phải ở trang login
            if (window.location.pathname !== '/login' || window.location.pathname !== '/reset-password') {
                store.dispatch(logoutSuccess());
                clearAuthData();
                window.location.href = '/login';
            }

            return Promise.reject(error); // Reject với lỗi 403
        }
        return Promise.reject(error); // Nếu có lỗi khác, reject với lỗi gốc
    }
);

export default axiosInstance;
