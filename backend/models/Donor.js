const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  aadhar: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  distt: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  attended: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

module.exports = mongoose.model('Donor', donorSchema);
