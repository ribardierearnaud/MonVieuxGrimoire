const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

const bookCtrl = require('../controllers/book');

// Routes pour obtenir les notes
router.get('/bestrating/', bookCtrl.getBestRating);
router.post('/:id/rating/', auth, bookCtrl.addRating);

// Routes pour la gestion des livres
router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getOneBook);



module.exports = router;