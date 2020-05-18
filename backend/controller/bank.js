
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const Bank = require('../models/BloodBank');
const Donor = require('../models/Donor');
const Post = require('../models/Post');

exports.createBankProfile = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = errors.errors[0].msg;

    const error = new Error(err);
    error.statusCode = 422;
    throw error;
  }
  
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const contact = req.body.contact;
  const type = req.body.type;
  const description = req.body.description;
  const distt = req.body.distt;
  const state = req.body.state;

  Donor.findOne({email: email})
    .then(donor => {
      if(donor){
         res.status(500).json({ message: 'Please pick another email !' });
         return;
      }

  bcrypt
  .hash(password, 12)
  .then(hashedPw => {
  const bank = new Bank({
      name: name,
      email: email,
      password: hashedPw,
      contact: contact,
      type: type,
      description: description,
      distt: distt,
      state: state,
    });

    return bank.save();
  })
  .then(result => {
    res.status(201).json({ message: 'Bank created!', userId: result._id });
  })
  .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  });
};

exports.updateBankProfile = (req, res, next) => {
  const profileId = req.params.profileId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = errors.errors[0].msg;

    const error = new Error(err);
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const contact = req.body.contact;
  const type = req.body.type;
  const description = req.body.description;
  const distt = req.body.distt;
  const state = req.body.state;


  Bank.findById(profileId)
    .then(bank => {
      
      bcrypt.hash(password, 12).then(hashedPw =>{

        bank.name = name,
        bank.email = email,
        bank.password = hashedPw,
        bank.contact = contact,
        bank.type = type,
        bank.description = description,
        bank.distt = distt,
        bank.state = state

        return bank.save();

      })
      .then(result => {
        res.status(201).json({ message: 'Bank profile updated!', userId: result._id });
      }) 
    })
  .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



exports.getBankProfile = (req, res, next) => {
  const profileId = req.params.profileId;
  Bank.findById(profileId)
    .populate('posts')
    .then(bank => {
      if (!bank) {
        const error = new Error('Could not find bank.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Bank', bank: bank });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.deleteBankProfile = (req, res, next) => {
  const profileId = req.params.profileId;
  Post.findOne({ creator: profileId })
    .then(post => {
      post.remove()
    })
  Bank.findByIdAndRemove(profileId)
    .then(() => {
      res.status(200).json({ message: 'Delete Bank.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};