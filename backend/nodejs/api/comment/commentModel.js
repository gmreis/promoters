const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true},
    comment: { type: String, required: true},
}, {timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);