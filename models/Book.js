const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true},
    ratings: [
      {
        userID:{ type: String, required: false },
        grade: { type: Number, required: false },
      }
    ],
    averagerating: { type: Number, required: false },
  });
  
  module.exports = mongoose.model('Book', bookSchema);