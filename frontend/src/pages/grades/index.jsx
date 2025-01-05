import { useEffect, useState } from 'react';
import './style.scss';
import MenuItems from '../../components/menu/menuItems';
import { getClass, getStudentByClass } from '../../api/gradeAPI';
import { useDispatch } from 'react-redux';

export default function Grades() {
    const dispatch = useDispatch();
    const [grades, setGrades] = useState([]); // Danh sách lớp
    const [studentsByClass, setStudentsByClass] = useState({}); // Lưu trữ học sinh theo lớp
    const [selector, setSelector] = useState(null); // Lớp được chọn
    const [activeCard, setActiveCard] = useState(null); // Lớp đang mở

    const statusTray = {
        received: 'Đã nhận',
        returned: 'Đã trả',
        not_received: 'Chưa nhận',
    };

    // Gọi API lấy danh sách lớp khi component mount
    useEffect(() => {
        const fetchClasses = async () => {
            const res = await getClass(dispatch);
            setGrades(res.data || []);
        };
        fetchClasses();
    }, [dispatch]);

    // Gọi API lấy học sinh chỉ khi lớp được chọn và chưa có dữ liệu
    useEffect(() => {
        if (selector !== null && !studentsByClass[selector]) {
            const fetchStudents = async () => {
                const res = await getStudentByClass(grades[selector], dispatch);
                setStudentsByClass(prev => ({
                    ...prev,
                    [selector]: res?.data || [], // Lưu trữ dữ liệu học sinh theo lớp
                }));
            };
            fetchStudents();
        }
    }, [selector, grades, dispatch, studentsByClass]);

    // Hàm để xử lý khi chọn lớp
    const getGrade = (e, index) => {
        setActiveCard(prevActiveCard => prevActiveCard === index ? null : index);
        setSelector(index); // Cập nhật lớp được chọn
    };

    if (grades.length === 0) {
        return <h2 style={{ width: '100%', margin: '0px auto' }}>Chưa có lớp học nào được đăng ký</h2>;
    }

    return (
        <div className="gradePage">
            <MenuItems
                listItem={grades}
                func={getGrade}
                students={studentsByClass[selector] || []}
                activeCard={activeCard}
                statusTray={statusTray}
            />
        </div>
    );
}
