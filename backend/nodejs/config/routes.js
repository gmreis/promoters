const express = require('express')
const multer  = require('multer')

// Multer Settings for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
})
let upload = multer({ storage: storage })

module.exports = function(server) {

  server.use('/upload', express.static('upload'));

  server.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    next();
  })

  // API Routes
  const router = express.Router()

  server.use('/api/', router)

  const userService = require('../api/user/userService')

  // POST /api/user
  router.route('/user').post(userService.login)

  // GET /api/user/:faceId
  router.route('/user/:faceId').get(userService.getUser)

  // PUT /api/user
  router.route('/user').put(userService.editUser)

  const postService = require('../api/post/postService')

  // POST /api/post
  router.route('/post').post(upload.single('photo'), postService.addPost)

  // GET /api/post/:id
  router.route('/post/:id').get(postService.findPostById)

  // PUT /api/post
  router.route('/post').put(postService.editPost)

  // DELETE /api/posts
//  router.route('/post').delete(postService.deletePost)

  // GET /api/posts/:userId
  // GET /api/posts/:userId/:page
  router.route('/feeds/:userId').get(postService.getFeeds)
  router.route('/feeds/:userId/:page').get(postService.getFeeds)
  
  // POST /api/post/addLike
  router.route('/post/addLike').post(postService.addLike)

  // POST /api/post/removeLike
  router.route('/post/removeLike').post(postService.removeLike)

  const commentService = require('../api/comment/commentService')

  // POST /api/comment
  router.route('/comment').post(commentService.addComment)
  
  // PUT /api/comment
  router.route('/comment').put(commentService.editComment)

  // DELETE /api/comment
  router.route('/comment').delete(commentService.removeComment)
}
