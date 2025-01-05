const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Xóa các mã refreshToken đã hết hạn bằng cách sử dụng TTL Index
Schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const rfToken = mongoose.model('refreshToken', Schema);
module.exports = rfToken;