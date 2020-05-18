const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Donor = require('../models/Donor');
const Bank = require('../models/BloodBank');

exports.donorLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Donor.findOne({ email: email })
    .then(donor => {
      if(!donor) {
        const error = new Error('A donor with this email could not be found.');
        error.statusCode = 401;
        throw error;            
      } 
        loadedUser = donor;
        return bcrypt.compare(password, donor.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString(), msg: 'User Login' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.bankLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Bank.findOne({ email: email })
    .then(bank => {
      if(!bank) {
        const error = new Error('A bank with this email could not be found.');
        error.statusCode = 401;
        throw error;            
      } 
        loadedUser = bank;
        return bcrypt.compare(password, bank.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
