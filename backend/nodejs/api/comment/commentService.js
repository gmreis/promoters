const Comment = require('./commentModel');
const User = require('./../user/userModel');
const Post = require('./../post/postModel');

// POST /api/comment
/*
    {
        faceId: Number,
        postId: Text,
        commment: Text
    }
*/
function addComment(req, res) {
    
        let _user;
    
        User.findOne({faceId: req.body.faceId}).exec()
        .then(user => {
            if(!user)
                throw 'Usuario não encontrado';
            
            _user = user;
            return Post.findById(req.body.postId).exec();
        })
        .then((post) => {
            if(!post)
                throw 'Post não encontrado';
            
            let comment = new Comment({
                userId: _user._id,
                comment: req.body.comment
            });
            console.log('commentes', comment);
            post.comments.push(comment);
            console.log('post', post);
            return post.save();
        })
        .then(() => {
            res.status(200).end();
        })
        .catch(err => {
            console.error(err);
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
            res.status(400).end(JSON.stringify({errors}));
        })
    
}

// PUT /api/comment
/*
    {
        faceId: Number,
        postId: Text,
        commmentId: Text,
        comment: Text
    }
*/
function editComment(req, res) {
    
    let _user;

    User.findOne({faceId: req.body.faceId}).exec()
        .then(user => {
            if(!user)
                throw 'Usuario não encontrado';
            
            _user = user;
            return Post.findById(req.body.postId).exec();
        })
        .then((post) => {
            if(!post)
                throw 'Post não encontrado';
            
            let comment = post.comments.id(req.body.commentId);
            comment.comment = req.body.comment;
            
            return post.save();
        })
        .then(() => {
            res.status(200).end();
        })
        .catch(err => {
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
            res.status(400).end(JSON.stringify({errors}));
        })
    
}
    
// DELETE /api/comment
/*
    {
        faceId: Number,
        postId: Text,
        commmentId: Text
    }
*/
function removeComment(req, res) {
    
    let _user;

    User.findOne({faceId: req.body.faceId}).exec()
        .then(user => {
            if(!user)
                throw 'Usuario não encontrado';
            
            _user = user;
            return Post.findById(req.body.postId).exec();
        })
        .then((post) => {
            if(!post)
                throw 'Post não encontrado';
            
            post.comments.pull(req.body.commentId);
            
            return post.save();
        })
        .then(() => {
            res.status(200).end();
        })
        .catch(err => {
            var errors = {};
            for (var error in err.errors) {
                errors[error] = (err.errors[error]['message']);
            };
            res.status(400).end(JSON.stringify({errors}));
        })
    
}

module.exports = { addComment, editComment, removeComment }