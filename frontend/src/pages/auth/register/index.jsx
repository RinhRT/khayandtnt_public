import { useState } from "react";
import "./register.scss";
import RegisterAcc from "./registerAcc";
import CreateGrades from "./createGrades";
import CreateTrays from "./createTrays";

import Notification from '../../../components/notification'

const Register = () => {
  const [activeTab, setActiveTab] = useState("register"); // "register", "createClass", "registerTray"
  const [mode, setMode] = useState({
    status: false,
    type: "",
    message: ""
  })

  return (
    <div className="register-and-course">
      {
        mode.status && <Notification type={mode.type} message={mode.message} onClose={() => setMode({ status: false, message: "", type:""})} />
      }

      {/* Sidebar */}
      <div className="sidebar">
        <button
          className={`tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Đăng ký tài khoản
        </button>

        <button
          className={`tab ${activeTab === "createClass" ? "active" : ""}`}
          onClick={() => setActiveTab("createClass")}
        >
          Đăng ký lớp học
        </button>

        <button
          className={`tab ${activeTab === "registerTray" ? "active" : ""}`}
          onClick={() => setActiveTab("registerTray")}
        >
          Đăng ký khay
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === "register" && <RegisterAcc Mode={setMode}/>}
        {activeTab === "createClass" && <CreateGrades Mode={setMode}/>}
        {activeTab === "registerTray" && <CreateTrays Mode={setMode}/>}
      </div>
    </div>
  );
};

export default Register;