import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Lazy load các page
const HomePage = lazy(() => import('./pages/home'))
const Home = lazy(() => import('./pages/home/home'))
const Login = lazy(() => import('./pages/auth/login'))
const Register = lazy(() => import('./pages/auth/register/index'))
const ResetPassword = lazy(() => import('./pages/auth/reset-password'))
const Grades = lazy(() => import('./pages/grades'))
const QRCodeReader = lazy(() => import('./components/qrCode/QrCodeScanner'))
const QRCodeGenerator = lazy(() => import('./components/form/QRCodeGenerator'))
import Page404 from './pages/notFound/Page404'
import QueryResult from './components/menu/QueryResult'
const TrayQueryResult = lazy(() => import('./components/menu/trayQueryResult'))

function App() {
  // Lấy thông tin cấp độ người dùng từ Redux, mặc định là null nếu không có thông tin
  const { level } = useSelector(state => state.auth?.user?.data) || {};

  return (
    <Router>
      <Suspense fallback={<div className="loading-container"><div className="loading"></div></div>}>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="/" element={<Home />} />
            <Route path="grades" element={<Grades />} />

            {level <= 1 && (
              <>
                <Route path="/signup" element={<Register />} />
                <Route path="/download" element={<QRCodeGenerator />} />
                <Route path="/user-gear" element={<QueryResult />} />
                <Route path="/tray-gear" element={<TrayQueryResult />} />
              </>
            )}

            <Route path="/qr-code-reader" element={<QRCodeReader />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
