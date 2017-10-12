const mongoose = require('mongoose');

function getPoints() {
  return 123;
}

const userSchema = new mongoose.Schema({
  faceId: { type: String, required: true, index: {unique: true} },
  name: { type: String, required: true },
  sexo: { type: String, required: true },
  photo: { type: String, required: true },
  birth: { type: Date, default: null },
  position: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  premios: {
    icon: { type: String, default: "/img/algo.png" },
    title: { type: String, default: "You ROCK!" },
    description: { type: String, default: "100% de aprovação no PROMov Club" },
  }
}, { timestamps: true });


userSchema.virtual('getUser').get(function () {

  return {
      faceId: this.faceId,
      name: this.name,
      sexo: this.sexo,
      photo: this.photo,
      birth: this.birth,
      position: this.position,
      level: this.level,
      points: this.points,
      premios: this.premios,
      createdAt: this.createdAt
    };
});

const User = mongoose.model('User', userSchema);

module.exports = User;