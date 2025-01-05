import { useEffect, useState } from "react";
import UploadFile from "../../../components/form/upoadFile";
import { useDispatch, useSelector } from "react-redux";
import { createNew } from "../../../store/createNewSlice";
import { uploadFile } from "../../../store/uploadSlice";

const CreateGrades = (props) => {
  const { Mode } = props;
  const [classMode, setClassMode] = useState("single"); // "single", "file"
  const [dataName, setDataName] = useState("");
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();

  // Xử lý đăng ký lớp học riêng lẻ
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!dataName.trim()) {
      Mode({
        status: true,
        type: "warning",
        message: "Tên lớp học không được để trống!",
      });
      return;
    }

    try {
      Mode({ status: true, type: 'info', message: 'Đang xử lý. Vui lòng chờ...' })
      await dispatch(createNew({ path: "/grades/register", name: dataName }));
      Mode({ status: true, type: 'success', message: 'Đăng ký thành công' })
    } catch(error) {
      Mode({ status: true, type: 'error', message: 'Đăng ký thất bại' })
    }
  };

  // Xử lý tải file đăng ký lớp học
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      Mode({
        status: true,
        type: "warning",
        message: "Vui lòng chọn file trước khi tải lên!",
      });
      return;
    }
    
    try {
      Mode({ status: true, type: 'info', message: 'Đang xử lý. Vui lòng chờ...' })
      await dispatch(uploadFile({ path: "/grades/upload", file }));
      Mode({ status: true, type: 'success', message: 'Tải file thành công' })
    } catch(error) {
      Mode({ status: true, type: 'error', message: 'Tải file thất bại' })
    }
  };

  return (
    <div className="form">
      <h2>Đăng ký lớp học</h2>
      <div className="switch-buttons">
        <button
          className={`switch ${classMode === "single" ? "active" : ""}`}
          onClick={() => setClassMode("single")}
        >
          Đăng ký lớp học riêng lẻ
        </button>
        <button
          className={`switch ${classMode === "file" ? "active" : ""}`}
          onClick={() => setClassMode("file")}
        >
          Đăng ký lớp học bằng file
        </button>
      </div>

      {classMode === "single" && (
        <div className="form-content">
          <label>
            Tên lớp học
            <input
              type="text"
              placeholder="Nhập tên lớp học"
              onChange={(e) => setDataName(e.target.value)}
            />
          </label>
          <button className="submit-button" onClick={handleAdd}>
            Đăng ký lớp học
          </button>
        </div>
      )}

      {classMode === "file" && (
        <UploadFile
          header="Đăng ký lớp học bằng file"
          label="Tải file lớp học"
          submit="Tải lên và đăng ký lớp học"
          onFileUpload={setFile}
          func={handleUpload}
        />
      )}
    </div>
  );
};

export default CreateGrades;
