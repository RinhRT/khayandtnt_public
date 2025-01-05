import { useState, useEffect, useCallback } from 'react';
import QrScanner from 'react-qr-scanner'; // Gói thư viện quét QR
import "./style.scss";
import { useDispatch, useSelector } from 'react-redux';
import { getTrayByUser } from '../../api/trayAPI';
import Notification from '../../components/notification';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [hasCamera, setHasCamera] = useState(true); // Kiểm tra xem có camera không
  const [scanning, setScanning] = useState(true); // Điều khiển quét
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ status: false, message: '', type: '' }); // Quản lý thông báo
  const [data, setData] = useState(null);

  // Hàm xử lý kết quả quét mã QR
  const handleScan = useCallback((e) => {
    if (e && e.text) {
      setScanResult(e.text); // Lưu kết quả quét vào state
    }
  }, []);

  // Hàm xử lý lỗi trong quá trình quét
  const handleError = (err) => {
    console.error(err);
  };

  // Kiểm tra xem thiết bị có hỗ trợ máy ảnh không
  const checkCameraSupport = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameraDevices = devices.filter((device) => device.kind === 'videoinput');
      if (cameraDevices.length === 0) {
        setHasCamera(false); // Nếu không có camera, đặt trạng thái là false
      }
    } catch (err) {
      console.error("Không thể kiểm tra camera:", err);
      setHasCamera(false); // Nếu gặp lỗi trong quá trình kiểm tra, giả sử không có camera
    }
  };

  // Kiểm tra khi component được mount
  useEffect(() => {
    checkCameraSupport();
  }, []);

  // Gửi thông tin lên máy chủ khi có scanResult
  useEffect(() => {
    const fetchData = async () => {
      try {
        setScanning(false); // Tạm dừng quét khi đang xử lý kết quả
        setMessage({ status: true, message: 'Đang xử lý', type: 'info' });

        const res = await getTrayByUser({ _id: scanResult }, dispatch);
        
        setData(res);
        setScanResult(null); // Reset scanResult để quét lại
      } catch (err) {
        setScanResult(null);
      } finally {
        setScanning(true); // Tiếp tục quét
      }
    };

    if (scanResult) {
      fetchData();
    }
  }, [scanResult, dispatch]);

  useEffect(() => {
    if (data) {
      if (data.status >= 200 && data.status < 300) {
        setMessage({ status: true, message: data.message, type: 'success' });
      } else if (data && data.status >= 400) {
        setMessage({ status: true, message: data.message, type: 'error' });
      }
    }
  }, [data]);

  // Hàm đóng thông báo
  const handleCloseNotification = () => {
    setMessage({ status: false, message: '', type: '' }); // Đặt lại trạng thái message
    setData(null);
  };

  return (
    <div className="qr-container">
      <h2>Quét Mã QR</h2>

      {/* Hiển thị thông báo nếu có */}
      {message.status && (
        <Notification
          message={message.message}
          type={message.type}
          onClose={handleCloseNotification}
        />
      )}

      {/* Kiểm tra có camera không */}
      {!hasCamera ? (
        <div className="qr-error">
          <p>Thiết bị không hỗ trợ camera, không thể quét mã QR.</p>
        </div>
      ) : (
        // Hiển thị kết quả nếu có
        <>
          {scanResult ? (
            <div className="qr-result">
              <p>Mã khay của bạn là: <span>{scanResult}</span></p>
            </div>
          ) : (
            <p className="qr-waiting">Đang chờ quét mã QR...</p>
          )}

          {/* Thành phần quét mã QR */}
          <div className="qr-frame">
            {scanning && (
              <QrScanner
                delay={200} // Thời gian delay giữa các lần quét
                onError={handleError}
                onScan={handleScan}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QRScanner;
