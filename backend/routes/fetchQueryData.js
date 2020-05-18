const express = require('express');

const Donor = require('../models/Donor');
const Bank = require('../models/BloodBank');

const router = express.Router();

router.get('/donors', async (req, res) => {
  let donors = await Donor.find({});
    try{
      res.status(201).json({ message: 'All Donors', donors: donors });
    } catch {
      console.log(err);
    }
})

router.get('/banks', async (req, res) => {
  let banks = await Bank.find({});
    try{
      res.status(201).json({ message: 'All Blood Banks', banks: banks });
    } catch {
      console.log(err);
    }
})

module.exports = router;