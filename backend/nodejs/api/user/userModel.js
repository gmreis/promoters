const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  faceId: { type: Number, required: true, index: {unique: true} },
  name: { type: String, required: true},
  sexo: { type: String, required: true},
  photo: { type: String, required: true},
  birth: { type: String},
  position: { type: Number },
  level: { type: Number }
}, {timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;