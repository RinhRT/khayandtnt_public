const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    grade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'grades',
        default: null,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    status: {
        type: String,
        enum: ['received', 'returned', 'not_received'],
        default: 'not_received',
    },
    level: {
        type: Number,
        enum: [0, 1, 2],
        default: 2,
    },
    lastUpdatedDate: {
        type: Date,
        default: new Date(),
    },
}, { timestamps: true });

schema.post('save', async function (doc, next) {
    if (doc.status === 'returned') {
        setTimeout(async () => {
            try {
                await Users.findByIdAndUpdate(
                    doc._id,
                    { status: 'not_received' },
                    { new: true }
                );
            } catch (error) {
                console.error('Error updating user status:', error);
            }
        }, 30 * 60 * 1000); // 30 phút
    }
    next();
});

schema.statics.updateExpiredStatus = async function () {
    const thirtyMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);
    try {
        // Tìm tất cả các user có status 'returned' và lastUpdatedDate <= 30 phút trước
        const usersToUpdate = await Users.find({
            status: 'returned',
            updatedAt: { $lte: thirtyMinutesAgo }
        });

        // Cập nhật trạng thái từng user
        await Users.updateMany(
            { _id: { $in: usersToUpdate.map(user => user._id) } },
            { status: 'not_received' }
        );
    } catch (error) {
        console.error('Error updating expired statuses:', error);
    }
};

const Users = mongoose.model('users', schema);
module.exports = Users;
