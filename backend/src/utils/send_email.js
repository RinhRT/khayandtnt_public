const nodemailer = require('nodemailer');
const env = require('../configs/environment');

const sendMail = ({ email, title, subject, desc, otp, filePath }) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; }
            h1 { color: #333; text-align: center; }
            p { color: #555; line-height: 1.5; }
            .otp { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #007bff; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #999; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>${subject}</h1>
            <p>Xin chào,</p>
            <p>${desc}</p>
            <div class="otp"><strong>${otp}</strong></div>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <div class="footer">
                <p>Đội ngũ hỗ trợ khách hàng</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Tạo transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Thay đổi theo dịch vụ bạn sử dụng
        port: 465, // Port thường dùng cho TLS
        secure: true, // true cho port 465, false cho các port khác
        auth: {
            user: env.MAIL_USER, // Email của bạn
            pass: env.GOOGLE_PASSWORD, // Mật khẩu của bạn
        },
    });

    // Thiết lập email
    const mailOptions = {
        from: env.MAIL_USER,
        to: email,
        subject: subject,
        html: htmlContent,
        attachments: filePath ? [{ path: filePath }] : [] // Nếu có file đính kèm thì thêm vào
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error: ' + error);
        }
        console.log('Send email success');
    });
}

module.exports = sendMail;