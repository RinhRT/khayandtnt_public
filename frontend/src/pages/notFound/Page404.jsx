import React from 'react';
import './page404.scss';  // Import CSS file của bạn

const Page404 = () => {
  return (
    <div className="page-404">
      <h1>404</h1>
      <p>Trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
      <a href="/">Quay lại trang chủ</a>
    </div>
  );
};

export default Page404;
