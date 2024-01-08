const express = require('express');
const router = express.Router();
const {signUpLimiter, signInLimiter} = require('../middleware/limiter');

const userCtrl = require('../controllers/user');

// Routes pour la gestion des utilisateurs
router.post('/signup', signUpLimiter, userCtrl.signup);
router.post('/login', signInLimiter, userCtrl.login);

module.exports = router;