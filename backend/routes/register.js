const express = require('express');
const { body } = require('express-validator');

const Donor = require('../models/Donor');
const Post = require('../models/Post');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

//    Register
router.post('/:postId/:userId', (req, res) => {
  Donor.findById(req.params.userId)
    .then(donor => {
      if(!donor){
        const error = new Error('Only donor can register.');
        error.statusCode = 404;
        throw error;
      }
      Post.findById(req.params.postId)
        .then(post => {
          if(post.donors.filter(d => d.donor.toString() === req.params.userId).length > 0){
            return res.status(401).json({ msg: 'Donor already registered.'})
          }

          post.donors.unshift({ donor: req.params.userId });
          donor.attended.unshift(post);
          donor.save();

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json(err));
    })
})

//    confirmed
router.post('/confirmed/:postId/:userId', (req, res) => {
  
      Post.findById(req.params.postId)
        .then(post => {
          if(post.confirmed.filter(d => d.donor.toString() === req.params.userId).length > 0){
            return res.status(401).json({ msg: 'Donor already confirmed.'})
          }

          post.confirmed.push({ donor: req.params.userId });
          

          return post.save();
        })
        .then(result => {
          res.status(200).json({ message: 'Donor Confirmed!', data: result });
        })
        .catch(err => res.status(404).json(err));
    })


//    Remove from confirmed
router.delete('/confirmed/:postId/:userId', (req, res) => {
  
  Post.findById(req.params.postId)
    .then(post => {
      if(post.confirmed.filter(d => d.donor.toString() === req.params.userId).length === 0){
        return res.status(401).json({ msg: 'You are not confirmed yet.'})
      }

      //    Get remove index
      const removeIndex = post.confirmed.map(item  => item.donor.toString()).indexOf(req.params.userId);

      //    Splice out of array
      post.confirmed.splice(removeIndex, 1);
      
      //   Save
      return post.save()
    })
    .then(result => {
      res.status(200).json({ message: 'Donor is not now Confirmed!', data: result });
    })
    .catch(err => res.status(404).json(err));
})


//   Un Register
router.delete('/:postId', isAuth, (req, res) => {
  Donor.findById(req.userId)
    .then(donor => {
      if(!donor){
        const error = new Error('Only donor can do.');
        error.statusCode = 404;
        throw error;
      }
      Post.findById(req.params.postId)
        .then(post => {
          if(post.donors.filter(d => d.donor.toString() === req.userId).length === 0){
            return res.status(401).json({ msg: 'You have already un-register yet.'})
          }

          //    Get remove index
          const removeIndex = post.donors.map(item  => item.donor.toString()).indexOf(req.userId);
          const removePost = donor.attended.map(item => item === post ? indexOf(item) : '');

          //    Splice out of array
          post.donors.splice(removeIndex, 1);
          // donor.attended.splice(removePost, 1);
          donor.attended.pull(post);
          donor.save();
          //   Save
          post.save().then(post => res.json(post))

        })
        .catch(err => res.status(404).json(err));
    })
})

module.exports = router;