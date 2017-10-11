const mongoose = require('mongoose');

function getPoints() {
  return 123;
}

const userSchema = new mongoose.Schema({
  faceId: { type: Number, required: true, index: {unique: true} },
  name: { type: String, required: true },
  sexo: { type: String, required: true },
  photo: { type: String, required: true },
  birth: { type: Date },
  position: { type: Number },
  level: { type: Number }
}, { timestamps: true });


userSchema.virtual('getUser').get(function () {

  let user = {
      faceId: this.faceId,
      name: this.name,
      sexo: this.sexo,
      photo: this.photo,
      birth: this.birth,
      position: this.position,
      level: this.level,
    };

  user.points = 123;

  return user;
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;