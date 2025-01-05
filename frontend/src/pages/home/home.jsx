import { useEffect, useState } from 'react';
import './homeInfo.scss';
import { getAllUser} from '../../api/userAPI'

export default function Home() {
    const [data, setData] = useState(null);  // Dữ liệu của bạn (null ban đầu)
    const [loading, setLoading] = useState(true); // Trạng thái loading

    useEffect(() => {
        const fetching = async () => {
            const res = await getAllUser();
            if (res.data) {
                setData({
                    ...res.data,
                    total: res.data.not_received + res.data.returned + res.data.received
                });
                setLoading(false)
            } else {
                setData({ not_received: 0, returned: 0, received: 0, total: 0 });
            }
        };

        fetching();
    }, []);

    if (loading) {
        return <div>Đang lấy dữ liệu, vui lòng chờ...</div>; 
    }

    const trayAnalysis = [
        {
            type: "Chưa nhận khay",
            percentage: data.not_received / data.total * 100 || 0, 
            color: "#ff4d4d",
        },
        {
            type: "Đã nhận khay",
            percentage: data.received / data.total * 100 || 0, 
            color: "#00ff6a",
        },
        {
            type: "Đã trả khay",
            percentage: data.returned / data.total * 100 || 0, 
            color: "#ffd700",
        },
    ];

    return (
        <div className="home-info">
            <h2 className="analysis-title">Phân tích tỉ lệ khay</h2>
            <table className="analysis-table">
                <thead>
                    <tr>
                        <th>Loại</th>
                        <th>Tỉ lệ (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {trayAnalysis.map((item, index) => (
                        <tr key={index} style={{ backgroundColor: item.color + '30' }}>
                            <td>{item.type}</td>
                            <td>
                                <div className="percentage-bar" style={{ backgroundColor: item.color, width: `${item.percentage || 1}%` }}>
                                    {item.percentage.toFixed(2)}% 
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}