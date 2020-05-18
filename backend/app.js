const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donor');
const bankRoutes = require('./routes/bank');
const postRoutes = require('./routes/post');
const registerRoutes = require('./routes/register');
const fetchData = require('./routes/fetchQueryData');
const Post = require('./models/Post');

// Post.find({})
//     .then(data => {
//       data.forEach(d => {
//       let allDonors = d.donors;
//       if(allDonors.length > 0){
//         allDonors.filter(p => {
//           if(p.donor == "5ebd9bf0bb4d916c2b4def4c"){
//             data.allDonors.pull(p)
//             data.save();
//           }
//         })
//       }
//       })
//     })



app.use(bodyParser.json()); 
app.use(cors());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
    
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/', fetchData);
app.use('/auth', authRoutes);
app.use('/donor', donorRoutes);
app.use('/bank', bankRoutes);
app.use('/post', postRoutes);
app.use('/register', registerRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb://localhost/blood-bank',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    const server = app.listen(5000);
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected.');
    })
    console.log('MongoConnect');
  })
  .catch(err => console.log(err));
