require('dotenv').config() // truy cập đến file environment (.env)

const env = {
    MODE_ENV: process.env.MODE_ENV,
    DATABASE: process.env.DATABASE,

    MONGO_URL: process.env.MONGO_URL,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,

    GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD,
    MAIL_USER: process.env.MAIL_USER,

    PORT: process.env.PORT
}

module.exports = env
