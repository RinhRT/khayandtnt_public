import { useState, useEffect } from "react";
import "./resetPassword.scss"; // CSS file dành riêng cho Reset Password
import { checkOTP, getUser, updateUser } from "../../../api/userAPI"; // Các API cần thiết
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import verifyEmail from "../../../verify/email";

import Notification from '../../../components/notification';

const ResetPassword = () => {
  const [submit, setSubmit] = useState(false);
  const [time, setTime] = useState(60);
  const [data, setData] = useState({ email: '', password: '', otp: '' });
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState({
    status: false,
    type: "",
    message: ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Bộ đếm thời gian hết hạn của mã OTP
  useEffect(() => {
    if (time > 0 && submit) {
      const timer = setInterval(() => {
        setTime((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (time === 0 && submit) {
      setTime(60);
      setSubmit(false);
    }
  }, [submit, time]);

  // Function xử lý thông tin khi người dùng nhập vào
  const handleChangeData = (e) => {
    if (!submit) {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else if (submit && e.target.name === 'otp') {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submit) {
      // Kiểm tra email hợp lệ
      if (!verifyEmail(data.email)) {
        setMode({ status: true, type: 'error', message: 'Email không hợp lệ' });
        return;
      }

      if (!data.password) {
        setMode({ status: true, type: 'error', message: 'Vui lòng nhập mật khẩu mới' });
        return;
      }

      let res = await getUser({ path: 'reset', ...data })

      if (res.status === 200) {
        setMode({ status: true, type: 'info', message: 'Mã OTP đã được gửi' });
        setSubmit(true)
        setUser(res)
      } else {
        setMode({ status: true, type: 'error', message: 'Tài khoản không tồn tại' });
      }
    } else if (submit) {
      if (!data.otp) {
        setMode({ status: true, type: 'error', message: 'Vui lòng nhập mã OTP' });
        return;
      }
      
      let res = await checkOTP({ code: data.otp, accessToken: user.accessToken }, dispatch, null, null)
      
      if (res.status === 200) {
        let re = await updateUser({path: 'update', ...data})
        if (re.status === 200) {
          setMode({ status: true, type: 'success', message: 'Tạo mật khẩu mới thành công' });
          navigate('/login')
        } 
        setMode({ status: true, type: 'success', message: 'Tạo mật khẩu mới thất bại' });
      } else {
        setMode({ status: true, type: 'error', message: 'Mã OTP không khớp' });
      }
    }
  };

  return (
    <div className="body-container">
      {
        mode.status && <Notification type={mode.type} message={mode.message} onClose={() => setMode({ status: false, message: "", type:""})} />
      }

      <div className="register-container">
        <div className="register-left">
          <h2>Khôi phục mật khẩu</h2>
          <form className="register-form">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChangeData}
              value={data.email}
            />
            <label>Mật khẩu mới</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your new password"
              onChange={handleChangeData}
              value={data.password}
            />
            {submit && (
              <>
                <label>The OTP code will expire in: {time}s</label>
                <input
                  name="otp"
                  type="text"
                  placeholder="Enter your OTP"
                  maxLength={6}
                  onChange={handleChangeData}
                  value={data.otp}
                />
              </>
            )}
            <button type="submit" onClick={handleSubmit}>
              {submit ? 'Xác nhận OTP' : 'Gửi mã OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
