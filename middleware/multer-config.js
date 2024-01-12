const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(new Error("Seules les images sont autorisées !"));
    }
};

const imageUploader = multer({
    storage,
    fileFilter: filter
});

const upload = imageUploader.single('image');

module.exports = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error("Multer Error:", err);
            return res.status(400).json({ error: 'Une erreur Multer est survenue.' });
        } else if (err) {
            console.error("Upload Error:", err);
            return res.status(500).json({ error: err.message || 'Une erreur est survenue lors du traitement de l\'image.' });
        }

        // Si l'upload est réussi, redimensionner l'image avec Sharp
        if (req.file) {
            try {
                const resizedBuffer = await sharp(req.file.buffer).resize(600).toBuffer();

                // On stocke en mémoire de l'image redimensionnée si elle est de taille inférieure à celle uploadée par l'utilisateur
                if(req.file.buffer.length > resizedBuffer.length) {
                    req.file.buffer = resizedBuffer;
                }

                // On stocke le fichier final sur le disque
                const fileName = `${Date.now()}_${req.file.originalname}`;
                const filePath = path.join('images', fileName);
                await fs.writeFile(filePath, req.file.buffer);

                req.file.filename = fileName;

                next();
            } catch (sharpError) {
                console.error("Sharp Error:", sharpError);
                return res.status(500).json({ error: 'Une erreur est survenue lors du redimensionnement de l\'image.' });
            }
        } else {
            next();
        }
    });
};