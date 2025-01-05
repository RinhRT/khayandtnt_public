const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    gradeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'grades',
        default: null
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Trays = mongoose.model('trays', schema)
module.exports = Trays