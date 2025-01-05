import { useState } from "react";
import UploadFile from "../../../components/form/upoadFile";
import { createNew } from "../../../store/createNewSlice";

import {useDispatch} from 'react-redux'
import verifyEmail from '../../../verify/email'
import { uploadFile } from "../../../store/uploadSlice";

const RegisterAcc = (props) => {
  const {Mode} = props
  const dispatch = useDispatch()

  const [registerMode, setRegisterMode] = useState("single"); // "single", "file"
  var [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    grade: "",
    level: 2
  })
  const [file, setFile] = useState(null)

  const handleUpload = async (e) => {
    e.preventDefault()

    if(file) {
      Mode({status: true, type: 'info', message: 'Đang xử lý. Vui lòng chờ...'})
      await dispatch(uploadFile({ path: '/user/upload', file }))
      Mode({status: true, type: 'success', message: 'Đăng ký thành công' })
    } else Mode({status: true, type: 'error', message: 'File không thể trống'})
  }

  const verifyData = () => {
    if (data.level === 0 && data.level > 2) data.level = 2
    if (!data.name){
      Mode({ status: true, type: 'warning', message: 'Tên không thể bỏ trống' })
      return false;
    }
    if (!verifyEmail(data.email)){
      Mode({ status: true, type: 'warning', message: 'Email trống hoặc không hợp lệ' })
      return false;
    }
    if (!data.password || data.password.length < 6){
      Mode({ status: true, type: 'warning', message: 'Mật khẩu ít nhất phải có 6 ký tự' })
      return false;
    }
    return true
  }

  const changeData = (e) => {
    setData(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        if (verifyData()) {
          Mode({status: true, type: 'info', message: 'Đang xử lý. Vui lòng chờ...'})
          await dispatch(createNew({ path: '/user/register', ...data }))
          Mode({status: true, type: 'success', message: 'Đăng ký thành công' })
          setData({ name: "", email: "", password: "", grade: "", level: 2 })
        }
    } catch(error) {
      Mode({status: true, type: 'error', message: 'Đăng ký không thành công'})
    }
  }

  return (
    <div className="form">
      <h2>Đăng ký tài khoản</h2>
      <div className="switch-buttons">
        <button
          className={`switch ${registerMode === "single" ? "active" : ""}`}
          onClick={() => setRegisterMode("single")}
        >
          Đăng ký cá nhân
        </button>
        <button
          className={`switch ${registerMode === "file" ? "active" : ""}`}
          onClick={() => setRegisterMode("file")}
        >
          Đăng ký bằng file
        </button>
      </div>

      {registerMode === "single" && (
        <div className="form-content">
          <label>
            Tên tài khoản
            <input onChange={changeData} value={data.name} name="name" type="text" placeholder="Nhập tên tài khoản của bạn" />
          </label>
          <label>
            Email
            <input onChange={changeData} value={data.email} name="email"  type="email" placeholder="Nhập email" />
          </label>
          <label>
            Mật khẩu
            <input onChange={changeData} value={data.password} name="password"  type="password" placeholder="Nhập mật khẩu" />
          </label>
          <label>
            Lớp học
            <input onChange={changeData} value={data.grade} name="grade" type="text" placeholder="Nhập lớp học(có thể để trống)" />
          </label>
          <label>
            Cấp bậc
            <input onChange={changeData}
              name="level" 
              type="number"
              placeholder="Nhập cấp bậc (1: cao nhất, 2: thấp nhất)"
              defaultValue={2}
              max={2}
              min={1}
            />
          </label>
          <button onClick={handleSubmit} className="submit-button">Đăng ký tài khoản</button>
        </div>
      )}

      {registerMode === "file" && (
        <UploadFile
          header="Đăng ký tài khoản bằng file"
          label="Tải file lên"
          submit="Tải lên và đăng ký"
          onFileUpload={setFile}
          func={handleUpload}
        />
      )}
    </div>
  );
};

export default RegisterAcc;