const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./../comment/commentModel').schema;

const postSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users'},
  userName: { type: String, required: true},
  userPhoto: { type: String, required: true},
  
  isChallenge: { type: Boolean, default: false },
  photos: { type: [String], validate: [photosMin, '{PATH} deve ter no minimo 1']},

//  comment: { type: String},

  type: { type: String, required: true},
  brand: { type: String, required: true},
  supermarket: { type: String, required: true},
  store: { type: String, required: true},

  longitude: { type: String, required: true},
  latitude: { type: String, required: true},
  address: [ {
        streetNumber: {type: String},
        streetName: {type: String},
        neighborhood: {type: String},
        stateLong: {type: String},
        stateShort: {type: String},
        city: {type: String},
        country: {type: String},
        countryCode: {type: String},
        zipcode: {type: String},
      } ],

  likes: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
  comments: [commentSchema],

  isBlog: { type: Boolean, default: false },
  title: { type: String }

}, { timestamps: true });

function photosMin(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Posts', postSchema);