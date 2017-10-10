const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  faceId: { type: Number, required: true, index: true},
  name: { type: String, required: true},
  email: { type: String, required: true},
  sexo: { type: String, required: true},
  photo: { type: String, required: true},
  typeUser: { type: String, required: true},
})

const User = mongoose.model('User', userSchema);

module.exports = User;