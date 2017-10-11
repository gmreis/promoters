const express = require('express')
const url = require('url')

module.exports = function(server) {

  server.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');


    //console.log("Olá Mundo...");
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

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

  // POST /api/users/authenticate
//  router.route('/users/authenticate').post(userService.authenticate)

  const postService = require('../api/post/postService')

  // POST /api/post
  router.route('/post').post(postService.addPost)

  // GET /api/post/:id
  router.route('/post/:id').get(postService.findPostById)

  // PUT /api/post
  router.route('/post').put(postService.editPost)

  // DELETE /api/posts
//  router.route('/post').delete(postService.deletePost)

  // GET /api/posts
  // GET /api/posts/:page
  router.route('/posts').get(postService.findAllPosts)
  router.route('/posts/:page').get(postService.findAllPosts)
  
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
