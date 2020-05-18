const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Bank',
      required: true
    },
    donors: [
      {
        donor: {
          type: Schema.Types.ObjectId,
          ref: 'Donor'
        }
      }
    ],
    confirmed: [
      {
        donor: {
          type: Schema.Types.ObjectId,
          ref: 'Donor'
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);