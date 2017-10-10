const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentId: { type: number, required: true},
    postId: { type: number, required: true},
    userId: { type: number, required: true},
    comment: { type: String, required: true},
})

const likeSchema = new mongoose.Schema({
    likeId: { type: number, required: true},
    postId: { type: number, required: true},
    userId: { type: number, required: true},
})

const postSchema = new mongoose.Schema({
  postId: { type: number, required: true},
  userId: { type: number, required: true},
  comment: { type: String, required: true},
  
  type: { type: String, required: true},
  brand: { type: String, required: true},
  supermarket: { type: String, required: true},
  store: { type: String, required: true},
  
  longitude: { type: String, required: true},
  latitude: { type: String, required: true},

  isChallenge: { type: boolean, required: true},

  photos: [String],
  likes: [{ type: ObjectId, ref: 'User'}],
  comments: [{
    userId: { type: ObjectId, ref: 'User'},
    comment: { type: String, required: true},
  }]
})

module.exports = mongoose.model('Post', userSchema);