const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./../comment/commentModel').schema;

const postSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users'},
  userName: { type: String, required: true},
  
  isChallenge: { type: Boolean, default: false },
  photos: { type: [String], validate: [photosMin, '{PATH} deve ter no minimo 1']},

//  comment: { type: String},

  type: { type: String, required: true},
  brand: { type: String, required: true},
  supermarket: { type: String, required: true},
  store: { type: String, required: true},

  longitude: { type: String, required: true},
  latitude: { type: String, required: true},

  likes: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
  comments: [commentSchema]

})

function photosMin(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Posts', postSchema);