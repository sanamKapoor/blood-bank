
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const Donor = require('../models/Donor');
const Bank = require('../models/BloodBank');
const Post = require('../models/Post');

exports.createDonorProfile = (req, res, next) => {
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
  const mobile = req.body.mobile;
  const aadhar = req.body.aadhar;
  const bloodGroup = req.body.bloodGroup;
  const gender = req.body.gender;
  const dob = req.body.dob;
  const weight = req.body.weight;
  const age = req.body.age;
  const distt = req.body.distt;
  const state = req.body.state;

  Bank.findOne({email: email})
    .then(bank => {
      if(bank){
         res.status(500).json({ message: 'Please pick another email !' });
         return;
      }

  bcrypt
  .hash(password, 12)
  .then(hashedPw => {
  const donor = new Donor({
      name: name,
      email: email,
      password: hashedPw,
      mobile: mobile,
      aadhar: aadhar,
      bloodGroup: bloodGroup,
      gender: gender,
      dob: dob,
      weight: weight,
      age: age,
      distt: distt,
      state: state,
    });

    return donor.save();
  })
  .then(result => {
    res.status(201).json({ message: 'Donor created!', userId: result._id });
  })
  .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  });
};


exports.updateDonorProfile = (req, res, next) => {
  const profileId = req.params.profileId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = errors.errors[0].msg;

    console.log('my error', err);
    const error = new Error(err);
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const mobile = req.body.mobile;
  const aadhar = req.body.aadhar;
  const bloodGroup = req.body.bloodGroup;
  const gender = req.body.gender;
  const dob = req.body.dob;
  const weight = req.body.weight;
  const age = req.body.age;
  const distt = req.body.distt;
  const state = req.body.state;


  Donor.findById(profileId)
    .then(donor => {
      
      bcrypt.hash(password, 12).then(hashedPw =>{

        donor.name = name,
        donor.email = email,
        donor.mobile = mobile,
        donor.password = hashedPw,
        donor.aadhar = aadhar,
        donor.bloodGroup = bloodGroup,
        donor.gender = gender,
        donor.dob = dob,
        donor.weight = weight,
        donor.age = age,
        donor.distt = distt,
        donor.state = state

        return donor.save();

      })
      .then(result => {
        res.status(201).json({ message: 'Donor profile updated!', userId: result._id });
      }) 
    })
  .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



exports.getDonorProfile = (req, res, next) => {
  const profileId = req.params.profileId;
  Donor.findById(profileId)
    .then(donor => {
      if (!donor) {
        const error = new Error('Could not find donor.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Donor', donor: donor });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteDonorProfile = (req, res, next) => {
  const profileId = req.params.profileId;
  Post.find({})
  .then(posts => {
    posts.map(post => {
      const removeIndex = post.donors.map(item  => item.donor.toString()).indexOf(profileId);
      post.donors.splice(removeIndex, 1);
      post.save();
    })
  })
  Donor.findByIdAndRemove(profileId)
    .then(() => {
      res.status(200).json({ message: 'Delete Donor.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};