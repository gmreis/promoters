// POST /api/posts
function addPost(req, res) {

    var image = '';
    if (req.body.hasOwnProperty('image'))
        image = req.body.image;

    var newPost = {
        "title": req.body.title,
        "description": req.body.description,
        "keys": req.body.keys,
        "author": req.body.author,
        "image": image,
        "date_create": date_create
    };

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

module.exports = { addPost, editPost, deletePost, findPostById, findAllPosts }