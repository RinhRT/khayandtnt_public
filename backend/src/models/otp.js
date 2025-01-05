const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  }
});

// Xóa các mã OTP đã hết hạn bằng cách sử dụng TTL Index
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPCode = mongoose.model('otp_code', otpSchema);
module.exports = OTPCode;