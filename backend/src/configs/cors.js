const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/apiError'); // Import class ApiError nếu bạn đã định nghĩa nó
const env = require('./environment'); // Import file config cho môi trường (nếu có)

const WHITELIST_DOMAINS = ['http://localhost:5173']; // Danh sách các domain được phép

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], //Các phương thức được phép gọi đến

    origin: function (origin, callback) {
        // Cho phép POSTMAN gọi API khi origin là undefined và môi trường là dev
        if (!WHITELIST_DOMAINS.includes(origin) && env.MODE_ENV === 'develop') {
            return callback(null, true);
        }

        // Kiểm tra domain có nằm trong danh sách được phép hay không
        if (WHITELIST_DOMAINS.includes(origin)) {
            return callback(null, true);
        }

        // Nếu domain không được phép, trả về lỗi
        return callback(
            new ApiError(
                StatusCodes.FORBIDDEN,
                `${origin || 'Unknown origin'} not allowed by our CORS Policy.`
            )
        );
    },

    optionsSuccessStatus: 200, // Trả về 200 với các preflight request
    credentials: true,         // Cho phép gửi cookies
};

module.exports = corsOptions;
