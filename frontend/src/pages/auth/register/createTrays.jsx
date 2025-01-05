import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTray } from "../../../api/trayAPI";
import { uploadFile } from '../../../store/uploadSlice'

const CreateTrays = (props) => {
  const { Mode } = props
  const [trayName, setTrayName] = useState("");
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("single"); // "single" | "file"

  const dispatch = useDispatch();

  const handleAddTray = async () => {
    if (!trayName.trim()) {
      Mode({
        status: true,
        type: 'warning',
        message: 'Không thể để trống dữ liệu'
      })
      return;
    }

    try {
      await addTray({name: trayName}, dispatch)
      setTrayName("");
  
      Mode({
        status: true,
        type: 'success',
        message: 'Thêm mới thành công'
      })
    } catch(error) {
      Mode({
        status: true,
        type: 'error',
        message: 'Thêm mới thất bại'
      })
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      Mode({
        status: true,
        type: 'warning',
        message: 'Không thể để trống dữ liệu'
      })
      return;
    }

    try {
      Mode({status: true, type: 'info', message: 'Đang xử lý. Vui lòng chờ...'})
      const data = await dispatch(uploadFile({ path: '/trays/register-file', file: file }));

      if (data.payload.status >= 200 && data.payload.status <300)
      Mode({
        status: true,
        type: 'success',
        message: 'Thêm mới thành công'
      })
    } catch(error) {
      Mode({
        status: true,
        type: 'error',
        message: 'Thêm mới thất bại'
      })
    }
  };

  return (
    <div className="form">
      <h2>Đăng ký khay</h2>
      <div className="switch-buttons">
        <button
          className={`switch ${mode === "single" ? "active" : ""}`}
          onClick={() => setMode("single")}
        >
          Đăng ký một khay
        </button>
        <button
          className={`switch ${mode === "file" ? "active" : ""}`}
          onClick={() => setMode("file")}
        >
          Đăng ký khay bằng file
        </button>
      </div>

      {mode === "single" && (
        <div className="form-content">
          <label>
            Tên khay
            <input
              type="text"
              value={trayName}
              onChange={(e) => setTrayName(e.target.value)}
              placeholder="Nhập tên khay"
            />
          </label>
          <button className="submit-button" onClick={handleAddTray}>
            Đăng ký khay
          </button>
        </div>
      )}

      {mode === "file" && (
        <div className="form-content">
          <label>
            Tải file khay
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".csv, .xlsx"
            />
          </label>
          <button className="submit-button" onClick={handleFileUpload}>
            Tải lên và đăng ký khay
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateTrays;
