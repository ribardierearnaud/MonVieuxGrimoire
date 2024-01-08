const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


exports.signup = (req, res, next) => {
    // On hash le mot de passe 10 fois
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            // On sauvegarde l'utilisateur en base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json ({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            // On renvoie une erreur générique m^me si l'on sait que le problème vient seulement du nom d'utilisateur
            res.status(401).json({message: 'Le couple identifiant/mot de passe est incorrecte'});
        } else {
            // On compare le mot de passe saisie avec le hash stocké en base
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: 'Le couple identifiant/mot de passe est incorrecte'});
                }else{
                    // On retourne le userId + le token d'authentification valable 24h
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            {userId: user.id},
                            `${process.env.SECRET_TOKEN}`,
                            {expiresIn: '24h'}
                            )
                    });
                }
            })
            .catch(error => {
                res.status(500).json( { error } );
            })
        }
    }
    )
    .catch(error => {
        res.status(500).json( {error} );
    })
};