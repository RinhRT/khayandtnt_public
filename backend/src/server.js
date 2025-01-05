const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const crone = require('node-cron')

// Log
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// DB and OPTN
const { CONNECT_DB } = require('./configs/mongodb');
const corsOptions = require('./configs/cors');
const { errorHandlingMiddleware } = require('./middlewares/errorHandling');
const env = require('./configs/environment');

// Tạo ứng dụng Express
const app = express();
const PORT = env.PORT || 8080

// Cấu hình rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 150, // tối đa 150 yêu cầu mỗi IP
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
});

// Cấu hình logger với winston
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD', // Định dạng ngày
            zippedArchive: true, // Nén các log cũ
            maxSize: '20m', // Giới hạn kích thước file log
            maxFiles: '14d' // Giữ lại logs trong 14 ngày
        })
    ]
});

const Users = require('./models/user')

//Tự động xử lý theo thời gian được định sẵn
crone.schedule('0 0 * * *', async () => {
    await Users.updateExpiredStatus()
})

const start = async () => {
    // Xử lý kết nối database
    try {
        await CONNECT_DB()
        logger.info('Kết nối cơ sở dữ liệu thành công')
    } catch (error) {
        logger.error('Lỗi kết nối cơ sở dữ liệu:', error)
        process.exit(1);  // Dừng server nếu không kết nối được DB
    }

    // // Sử dụng middleware
    app.use(errorHandlingMiddleware);  // Xử lý lỗi tập trung

    app.use(helmet());  // Bảo mật ứng dụng
    app.use(limiter);  // Giới hạn tốc độ yêu cầu
    app.use(morgan('common', {
        stream: {
            write: (message) => logger.info(message.trim())  // Log mỗi yêu cầu HTTP
        }
    }))

    app.use(cookieParser());  // Xử lý cookie
    app.use(express.json({ limit: '4Mb' }));  // Cấu hình bodyParser cho JSON
    app.use(express.urlencoded({ extended: true }));  // Cấu hình bodyParser cho URL-encoded
    app.use(cors(corsOptions));  // Cấu hình CORS

    // Các route
    app.use('/v1/user', require('./routes/userRt'));
    app.use('/v1/trays', require('./routes/trayRt'));
    app.use('/v1/grades', require('./routes/gradeRt'));
    app.use('/v1/qrdata', require('./routes/qRcodeRt'));
    app.use('/v1/optcode', require('./routes/optCodeRt'));
    app.use('/v1/refresh-token', require('./routes/token'));

    // Lắng nghe tại cổng 8080
    app.listen(PORT, () => {
        logger.info(`Server is running on PORT: ${PORT}`);
    });
};
start();