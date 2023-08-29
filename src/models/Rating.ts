import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var rating = new Schema({
  owner: {
    type: Object,
    required: true,
  },
  destination: {
    type: Object,
    required: true,
  },
  content: {
    type: String,
    required: true,
    min: 1
  },
  like: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Rating = mongoose.model('Rating', rating);

export default Rating;