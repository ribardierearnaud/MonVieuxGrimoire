const express = require('express');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const {generalLimiter} = require('./middleware/limiter');



mongoose.connect('mongodb+srv://arnaudribardiere:XAZ2iNu18b2yeUTw@cluster0.uqyafzw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// On appelle Helmet en customisant le Content-Security-Policy header pour autoriser l'affichage des images

app.use(generalLimiter)

app.use(
  helmet({
    crossOriginResourcePolicy: {policy: "cross-origin"}
    },
  ),
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
  }),
);

app.use(express.json());



// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// });

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;