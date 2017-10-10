const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    commentId: { type: Number, required: true},
    postId: { type: Number, required: true},
    userId: { type: Number, required: true},
    comment: { type: String, required: true},
})

const likeSchema = new mongoose.Schema({
    likeId: { type: Number, required: true},
    postId: { type: Number, required: true},
    userId: { type: Number, required: true},
})

const postSchema = new mongoose.Schema({
  postId: { type: Number},
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users'},
  comment: { type: String},
  /*
  type: { type: String, required: true},
  brand: { type: String, required: true},
  supermarket: { type: String, required: true},
  store: { type: String, required: true},
  
  longitude: { type: String, required: true},
  latitude: { type: String, required: true},

  isChallenge: { type: Boolean},

  photos: [String],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
  comments: [{
    faceId: { type: Schema.Types.ObjectId, ref: 'Users'},
    comment: { type: String, required: true},
  }]
  */

  likes: [{ type: Schema.Types.ObjectId, ref: 'Users'}],

})

module.exports = mongoose.model('Posts', postSchema);