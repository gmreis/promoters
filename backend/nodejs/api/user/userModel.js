const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  faceId: { type: Number, required: true, index: true},
  name: { type: String, required: true},
  sexo: { type: String, required: true},
  photo: { type: String, required: true},
  birth: { type: String, required: true},
  position: { type: Number, required: true },
  level: { type: Number, required: true }
}, {timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;