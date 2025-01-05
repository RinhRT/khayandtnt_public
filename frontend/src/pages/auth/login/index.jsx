import { useState, useEffect } from "react";
import "./login.scss";
import { checkOTP, logging } from "../../../api/userAPI";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import verifyEmail from "../../../verify/email";

import Notification from '../../../components/notification';

const Login = () => {
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
        setMode({ status: true, type: 'error', message: 'Vui lòng nhập mật khẩu' });
        return;
      }

      let userData = await logging({ email: data.email, password: data.password }, dispatch, navigate);

      if (userData.status === 200) {
        setMode({ status: true, type: 'info', message: `Mã OTP đã được gửi vào tài khoản của bạn` });
        setUser(userData.data);
        setSubmit(true);
      } else {
        setMode({ status: true, type: 'error', message: 'Email hoặc mật khẩu không đúng' });
      }
    } else if (submit) {
      let res = await checkOTP({ accessToken: user.accessToken, code: data.otp }, dispatch, navigate, user);

      res.status === 404 && setMode({ status: true, type: 'error', message: 'Mã OTP không đúng hoặc đã hết hạn.' });
    }
  };

  return (
    <div className="body-container">
      {
        mode.status && <Notification type={mode.type} message={mode.message} onClose={() => setMode({ status: false, message: "", type:""})} />
      }

      <div className="register-container">
        <div className="register-left">
          <h2>Chào Mừng Trở Lại</h2>
          <form className="register-form">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChangeData}
              value={data.email}
            />
            <label>Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
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
                />
              </>
            )}
            <button type="submit" onClick={handleSubmit}>
              {submit ? 'Đăng nhập' : 'Lấy mã OTP'}
            </button>
          </form>

          {/* Link chuyển hướng sang trang reset password */}
          <div className="reset-password-link">
            <Link to={"/reset-password"}>Quên mật khẩu?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
