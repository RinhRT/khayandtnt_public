import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { getTray } from "../../api/trayAPI";
import { useDispatch } from 'react-redux'
import './QRCodeGenerator.scss'

const QRCodeGenerator = () => {
  const dispatch = useDispatch()
  // Giả sử dữ liệu QR Code lấy từ cơ sở dữ liệu (danh sách các URL hoặc bất kỳ dữ liệu nào bạn muốn mã hóa vào QR)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetching = async () => {
      const res = await getTray(dispatch)
      setData(res.data)
      setLoading(false)
    } 
    fetching()
  }, [])

  // Hàm để tạo PDF với QR Codes
  const generatePDF = async () => {
    const doc = new jsPDF();
    const qrSize = 20; // Kích thước QR Code 2x2cm (20mm)
    const margin = 15; // Lề 5mm cho trang PDF
    const xStart = margin;
    const yStart = margin;

    let xPos = xStart;
    let yPos = yStart;

    // Lặp qua các dữ liệu để tạo QR Code
    try {
      data.map(async (value, idx) => {
        const qrCodeBase64 = await QRCode.toDataURL(value._id, {
          errorCorrectionLevel: 'H',
          type: 'image/png'  
        })

        if (yPos + qrSize > 297 - margin) {
          doc.addPage(); // Thêm trang mới
          yPos = margin; // Quay lại vị trí đầu trang
        }

        // Chèn QR Code vào PDF
        doc.addImage(qrCodeBase64, 'PNG', xPos, yPos, qrSize, qrSize);

        // Cập nhật vị trí cho QR Code tiếp theo
        xPos += qrSize + margin;

        // Nếu QR Code sắp vượt qua chiều rộng trang, chuyển sang dòng mới
        if (xPos + qrSize > 210 - margin) {
          xPos = margin; // Quay lại vị trí bên trái
          yPos += qrSize + margin; // Di chuyển xuống dòng tiếp theo
        }

        if (data.length -1 === idx) doc.save('QrCode.pdf')
      })
    }catch(error) {
      console.log('Tải file không thành công. Lỗi', error)
    }
  };

  return (
    <div>
      <h1>QR Code PDF Generator</h1>
      {loading && (
        <div className="loading-message">
          Đang lấy dữ liệu, vui lòng chờ trong giây lát...
        </div>
      )}

      {!loading && data && (
        <button className="primary" onClick={generatePDF}>
          Tải PDF chứa QR Codes
        </button>
      )}

      {!loading && !data && (
        <div className="loading-message">Không có dữ liệu để hiển thị</div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
