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
  router.route('/user').post(userService.addUser)

  // GET /api/user/:userId
  router.route('/user/:userId').get(userService.getUser)

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

  // DELETE /api/post
//  router.route('/post').delete(postService.deletePost)

  // GET /api/posts
  // GET /api/posts/:page
  router.route('/posts').get(postService.findAllPosts)
  router.route('/posts/:page').get(postService.findAllPosts)
  
}
