const express = require('express');
const { body } = require('express-validator');

const postController = require('../controller/post');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// GET /feed/posts
router.get('/all', postController.getPosts);

// POST /feed/post
router.post(
  '/',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  postController.createPost
);

router.get('/:postId', isAuth, postController.getPost);

router.put(
  '/:postId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  postController.updatePost
);

router.delete('/:postId', isAuth, postController.deletePost);

module.exports = router;
