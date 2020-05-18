const express = require('express');
const { body } = require('express-validator');

const bankController = require('../controller/bank');
const isAuth = require('../middleware/isAuth');

const Bank = require('../models/BloodBank');

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
        return Bank.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 4 }),
    body('contact')
      .isString()
      .isLength({ min: 4, max: 12})
      .trim(),    
    body('type')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('description')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('distt')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('state')
      .isLength({ min: 3, max: 100 })
      .trim()
  ],
  bankController.createBankProfile
);

//    Get Profile
router.get('/profile/:profileId', isAuth, bankController.getBankProfile);

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
    body('type')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('contact').isInt(),
    body('description')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('distt')
      .isLength({ min: 3, max: 100 })
      .trim(),
    body('state')
      .isLength({ min: 3, max: 100 })
      .trim()
  ],
  bankController.updateBankProfile
);


//    Delete Profile

router.delete('/profile/:profileId', isAuth, bankController.deleteBankProfile);

module.exports = router;
