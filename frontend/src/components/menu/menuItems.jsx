import { FaCaretDown } from 'react-icons/fa';
import React, { memo } from 'react';

const MenuItems = ({ listItem, func, students, activeCard, statusTray }) => {
    
    const formatDateToVietnamTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    };

    return (
        <div className="CardItem">
            {!listItem ? <p>Không có dữ liệu học sinh</p> : listItem.map((item, idx) => (
                <div
                    className={activeCard === idx ? 'card active' : 'card'}
                    key={item.id || idx}  // Sử dụng một giá trị duy nhất làm key
                >
                    <div className="card_header" onClick={(e) => func(e, idx)}>
                        <h2 className="title">{item.name}</h2>
                        <div className="icon">
                            <FaCaretDown />
                        </div>
                    </div>
                    {activeCard === idx && (
                        <div className="list">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Họ và tên</th>
                                        <th>Tình trạng khay</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, studentIdx) => (
                                        <tr key={student.id || studentIdx}>
                                            <td>{student.name}</td>
                                            <td>{statusTray[student.status]}</td>
                                            <td>
                                                {statusTray[student.status] === 'Chưa nhận' 
                                                    ? <span>-</span> :
                                                    formatDateToVietnamTime(student.lastUpdatedDate) 
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default memo(MenuItems);