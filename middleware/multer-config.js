const { Timestamp } = require('mongodb');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

// On définit sur quels types d'objets vont s'appliquer nos règles Multer
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    // On définit le répertoire où sont stockées les images
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // On supprime les espaces
        const name = file.originalname.split(' ').join('_');

        // On supprime l'extension dans le nom du fichier
        const nameWithoutExtension = name.slice(0, name.lastIndexOf('.'));

        // On récupère l'extension du fichier d'origine
        const extension = MIME_TYPES[file.mimetype];

        // On ajoute un timestamp pour garantir l'unitité du fichier
        const timestamp = Date.now();

        // On prépare le nom du fichier à stocker sur le serveur
        const finalFileName = `${nameWithoutExtension}_${timestamp}.${extension}`;

        // On le restitue
        callback(null, finalFileName);
    }
});

module.exports = multer({ storage }).single('image');