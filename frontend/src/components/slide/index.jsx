import { NavLink } from "react-router-dom";
import "./slide.scss";
import { useSelector } from "react-redux";
import {
    FaDownload,
    FaGraduationCap,
    FaHome,
    FaSign,
    FaCamera,
    FaUsers,
    FaMinusSquare,
    FaBars
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export default function Slide() {
    let user = useSelector((state) => state.auth?.user?.data);
    if (!user) {
        user = { level: 2 };
    }

    const [isOpen, setIsOpen] = useState(false);

    const menuRef = useRef(null); // Reference for the menu
    const toggleRef = useRef(null); // Reference for the toggle button

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                toggleRef.current &&
                !menuRef.current.contains(event.target) &&
                !toggleRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="slide">
            <NavLink className="item__link" to="/" exact="true" activeclassname="active">
                <div className="item">
                    <FaHome /> <span>Trang chủ</span>
                </div>
            </NavLink>
            {user.level <= 1 && (
                <NavLink className="item__link" to="/signup" exact="true" activeclassname="active">
                    <div className="item">
                        <FaSign /> <span>Đăng ký</span>
                    </div>
                </NavLink>
            )}
            <NavLink className="item__link" to="/qr-code-reader" exact="true" activeclassname="active">
                <div className="item camera-qrcode">
                    <FaCamera /> <span>Camera</span>
                </div>
            </NavLink>
            <NavLink className="item__link" to="/grades" exact="true" activeclassname="active">
                <div className="item">
                    <FaGraduationCap /> <span>Lớp học</span>
                </div>
            </NavLink>

            {/* Toggle button for mobile menu */}
            {user.level < 2 && (
                <div className="toggle-mobile" onClick={toggleMenu} ref={toggleRef}>
                    <div className="item">
                        <FaBars />
                    </div>
                </div>
            )}

            {/* Mobile menu */}
            <div className={`menu-mobile ${isOpen ? "open" : ""}`} ref={menuRef}>
                {user.level < 2 && (
                    <NavLink className="item__link" to="/download" exact="true" activeclassname="active">
                        <div className="item">
                            <FaDownload /> <span>Tải QR</span>
                        </div>
                    </NavLink>
                )}
                {user.level < 2 && (
                    <NavLink className="item__link" to="/tray-gear" exact="true" activeclassname="active">
                        <div className="item">
                            <FaMinusSquare /> <span>Khay ăn</span>
                        </div>
                    </NavLink>
                )}
                {user.level < 2 && (
                    <NavLink className="item__link" to="/user-gear" exact="true" activeclassname="active">
                        <div className="item">
                            <FaUsers /> <span>Học sinh</span>
                        </div>
                    </NavLink>
                )}
            </div>
        </div>
    );
}
