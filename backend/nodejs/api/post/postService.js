const Post = require('./postModel');
const User = require('./../user/userModel');

// POST /api/posts
function addPost(req, res) {

    var newPost = new Post({
        comment: req.body.comment,
    });    

    User.findOne({faceId: req.body.faceId}).exec()
        .then(user => {
            if(!user)
                throw 'Usuario não encontrado';
            
            newPost.userId = user._id;

            return newPost.save();

        })
        .then(() => {
            res.status(200).end(JSON.stringify(newPost));
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


// POST /api/posts/addLike
function addLike(req, res) {

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
        
        post.likes.addToSet(_user._id);
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

// POST /api/posts/removeLike
function removeLike(req, res) {
    
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
            
            post.likes.pull(_user._id);
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

// DELETE /api/posts
function deletePost(req, res) {

}

// GET /api/posts/find/:id
function findPostById(req, res) {
    const postId = req.params.id;

}

// GET /api/posts
// GET /api/posts/:page
function findAllPosts(req, res) {

    const limit = 5;

    var page = parseInt(req.params.page) || 1;
    page = page < 1 ? 1 : page;

    connection.view('viewPost', 'listAll',
        { limit: limit, skip: ((page - 1) * limit), reduce: false },
        function (err, body) {
            if (err) {
                res.status(400).end();
                return console.log('[posts.find] ', err.message);
            }

            var posts = [];
            for (var i = 0; i < body.rows.length; i++) {

                var post = {
                    "_id": body.rows[i].key._id,
                    "title": body.rows[i].key.title,
                    "description": body.rows[i].key.description,
                    "keys": body.rows[i].key.keys,
                    "author": body.rows[i].key.author,
                    "image": body.rows[i].key.image,
                    "date_create": body.rows[i].key.date_create
                };

                if (typeof post.description === 'string') {
                    post.description = post.description.substring(0, 100);
                }

                posts.push(post);
            }
            //console.log('POSTS:', posts);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).end(JSON.stringify({ total_rows: body.total_rows, rows: posts }));
        });

}

module.exports = { addPost, addLike, removeLike, editPost, deletePost, findPostById, findAllPosts }