const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
    try {
        //On vérifie si l'utilisateur est connecté
        if (!req.headers.authorization) {
            console.log('Authorization header not found'); 
            throw new Error('Authorization header not found');
        }
        // On récupère le token dans le header
        const token = req.headers.authorization.split(' ')[1];

        // On procède à la vérification du token à l'aide du token de hashage secret
        const decodedToken = jwt.verify(token, `${process.env.SECRET_TOKEN}`);
         
        // On ajoute le userId au corps de la requête
        req.auth = { id: decodedToken.userId };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Authentification échouée !' });
    }
};