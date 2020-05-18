const express = require('express');
const { body } = require('express-validator');

const donorController = require('../controller/donor');
const isAuth = require('../middleware/isAuth');

const Donor = require('../models/Donor');

const router = express.Router();

// Create Profile
router.post(
  '/profile',
  [
    body('name')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Donor.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 4 }),
    body('aadhar')
      .trim()
      .isLength({ min: 5 }),
    body('mobile')
      .isString()
      .isLength({ min: 4, max: 12})
      .trim(),
    body('distt')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('state')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('gender')
      .isString()
      .trim(),
    body('dob')
      .isString()
      .trim(),
    body('weight')
      .isInt(),
    body('age').isInt(),
  ],
  donorController.createDonorProfile
);

//    Get Profile
router.get('/profile/:profileId', isAuth, donorController.getDonorProfile);


//    Update Profile
router.put(
  '/profile/:profileId',
  [
    body('name')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('email')
      .isEmail()
      .isLength({ min: 3 })
      .trim(),
    body('password')
      .trim()
      .isLength({ min: 4 }),
    body('mobile')
      .isString()
      .isLength({ min: 4, max: 12})
      .trim(),
    body('aadhar')
      .trim()
      .isLength({ min: 5 }),
    body('distt')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('state')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('gender')
      .isString()
      .trim(),
    body('dob')
      .isString()
      .trim(),
    body('weight')
      .isInt(),
    body('age').isInt(),
  ],
  donorController.updateDonorProfile
);


//    Delete Profile

router.delete('/profile/:profileId', isAuth, donorController.deleteDonorProfile);

module.exports = router;
