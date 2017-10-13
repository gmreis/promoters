const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = require('./postModel');
const User = require('./../user/userModel');

var NodeGeocoder = require('node-geocoder');

const API_KEY = 'AIzaSyBY2qlQmAd_C3lPAEAPF4W7dz4LNZI37u8';

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
   
var geocoder = NodeGeocoder(options);


// POST /api/posts
/*
    {
        faceId: Number,
        comment: Text
    }
*/
function addPost(req, res) {

    var newPost = new Post({
//        comment: req.body.comment,
        isChallenge: req.body.isChallenge,
        photos: [ req.file.filename ],

        type: req.body.type,
        brand: req.body.brand,
        supermarket: req.body.supermarket,
        store: req.body.store,

        longitude: req.body.longitude,
        latitude: req.body.latitude,

    });
    
    newPost.title = req.body.title ? req.body.title: '';

    newPost.isBlog = req.body.isBlog ? req.body.isBlog : false;

    User.findOne({faceId: req.body.faceId}).exec()
        .then(user => {
            if(!user)
                throw 'Usuario não encontrado';
            
            newPost.userId = user._id;
            newPost.userName = user.name;
            newPost.userPhoto = user.photo;

            // -27.449017, -48.460939
            // -27.592227, -48.610541
            return geocoder.reverse({lat: req.body.latitude,  lon: req.body.longitude})

        })
        .then((geoddress) => {

            let address = geoddress.pop();
            console.log('Address', address);

            newPost.address = {
                streetNumber: address.streetNumber,
                streetName: address.streetName,
                neighborhood: address.extra.neighborhood,
                stateLong: address.administrativeLevels.level1long,
                stateShort: address.administrativeLevels.level1short,
                city: address.city,
                country: address.country,
                countryCode: address.countryCode,
                zipcode: address.zipcode
            };
            
            return User.addPoint(newPost, 10);
        })
        .then(() => {
            res.status(200).end(JSON.stringify(newPost));
        })
        .catch(err => {
            console.log('addPost', err);
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
            res.status(400).end(JSON.stringify({errors}));
        })
}

// POST /api/post/addLike
/*
    {
        faceId: Number,
        postId: Text
    }
*/
function addLike(req, res) {

    let _user;

    User.findOne({faceId: req.body.faceId}).exec()
        // Busca Usuario que dará o Like
        .then(user => {
            _user = user;
            return Post.findById(req.body.postId).exec();

        }, err => {  throw 'Usuario não encontrado'; })
        // Busca Post que receberá o Like
        .then((post) => {
            
            let likes = post.likes.length;
            post.likes.addToSet(_user._id);

            // Adiciona +5 Ponto para o Proprietario do Post
            // Se o usuário já não tiver dado like para esse Post
            if(post.likes.length > likes) {

                return User.addPoint(post, 5);
                
            }
            
            return new Promise(resolve => resolve(post));

        }, err => { throw 'Post não encontrado'; })
        .then( post => {
            res.status(200).end(JSON.stringify({ likes: post.likes.length }));
        })
        .catch(err => {
            res.status(400).end(JSON.stringify({err}));
        })

}

// POST /api/post/addDislike
/*
    {
        faceId: Number,
        postId: Text
    }
*/
function addDislike(req, res) {
    
    let _user;
    
        User.findOne({faceId: req.body.faceId}).exec()
            // Busca Usuario que dará o Like
            .then(user => {
                _user = user;
                return Post.findById(req.body.postId).exec();
    
            }, err => {  throw 'Usuario não encontrado'; })
            // Busca Post que receberá o Like
            .then((post) => {
                
                let dislikes = post.dislikes.length;
                post.dislikes.addToSet(_user._id);
    
                if(post.dislikes.length > dislikes) {
                    return post.save();
                }
                
                return new Promise(resolve => resolve(post));
    
            }, err => { throw 'Post não encontrado'; })
            .then( post => {
                res.status(200).end(JSON.stringify({ dislikes: post.dislikes.length }));
            })
            .catch(err => {
                res.status(400).end(JSON.stringify({err}));
            })
    
}

// TODO: editPost
// PUT /api/posts
function editPost(req, res) {

    if (err.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ err }));
        return console.log('[posts.edit.validacao] ', err);
    }

    var post = {
        "_id": req.body._id,
        "_rev": req.body._rev,
        "title": req.body.title,
        "description": req.body.description,
        "keys": req.body.keys,
        "author": req.body.author,
        "image": req.body.image
    };


}

// TODO: deletePost
// DELETE /api/posts
function deletePost(req, res) {

}

// TODO: findPostById
// GET /api/posts/find/:id
function findPostById(req, res) {
    const postId = req.params.id;

}

// GET /api/challenge/:faceId
function getChallenge(req, res) {
    
    const limit = 5;
    
    User.findOne({faceId: req.params.faceId}).exec()
        .then(user => {
            return Post.aggregate()
                .project({ 
                    userId: 1,

                    isChallenge: 1,
                    photos: 1,

                    isBlog: 1,

                    type: 1,
                    brand: 1,
                    supermarket: 1,
                    store: 1,

                    likes: 1,
                    dislikes: 1,

                })
                .match({
                    'userId': { '$ne': user._id },
                    'isChallenge': true,
                    'likes': { '$not': { '$in': [ user._id ] } },
                    'dislikes': { '$not': { '$in': [ user._id ] } },
                    'isBlog': false,
            })
                .limit(limit)
                .exec()
        })
        .then(posts => {
            res.status(200).end(JSON.stringify({ posts }));
        })
        .catch(err => {
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
            res.status(400).end(JSON.stringify({errors}));
        });
    
}

// GET /api/feeds/:faceId
// GET /api/feeds/:faceId/:page
function getFeeds(req, res) {

    const limit = 5;

    var page = parseInt(req.params.page) || 1;
    page = page < 1 ? 1 : page;
    
    User.findOne({faceId: req.params.faceId}).exec()
        .then(user => {
            return Post.aggregate()
                .project({ 
                    userId: 1, 
                    userName: 1, 
                    userPhoto: 1, 
                    
                    isChallenge: 1,
                    photos: 1,
        
                    type: 1,
                    brand: 1,
                    supermarket: 1,
                    store: 1,
        
                    longitude: 1,
                    latitude: 1,
        
                    likes: { '$size': '$likes'}, 
                    comments: 1,

                    isBlog: 1,
                    title: 1,

                    address: 1,
                    
                    createdAt: 1, 
                })
                .match({ 'userId': { '$ne': user._id } } )
                .sort({createdAt: -1})
                .skip( (page - 1) * limit ).limit(limit)
                .exec()
        })
        .then(posts => {
            res.status(200).end(JSON.stringify({ posts }));
        })
        .catch(err => {
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
            res.status(400).end(JSON.stringify({errors}));
        });
    
}

module.exports = { 
    addPost, editPost, deletePost,
    addLike, addDislike, 
    getChallenge,
    getFeeds }