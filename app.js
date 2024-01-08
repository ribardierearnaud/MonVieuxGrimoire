const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const {generalLimiter} = require('./middleware/limiter');


// On se connecte à la base de données MongoDB - les paramètres sont à stocker dans le fichier .env
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// On applique une limite d'appels au backend
app.use(generalLimiter)

// On appelle Helmet en customisant le Content-Security-Policy header pour autoriser l'affichage des images
app.use(
  helmet({
    crossOriginResourcePolicy: {policy: "cross-origin"}
    },
  ),
);

// On définie les URL ayant le droit d'appeler nos API
app.use(
  cors({
    origin: [`${process.env.FRONT_HOST}`, `${process.env.BACK_HOST}`],
  }),
);

app.use(express.json());

// On définit les routes de haut niveau de l'application
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;