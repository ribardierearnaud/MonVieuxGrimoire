const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            console.log('Authorization header not found'); 
            throw new Error('Authorization header not found');
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        
        // On ajoute le userId au corps de la requête
        req.auth = { id: decodedToken.userId };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Authentification échouée !' });
    }
};