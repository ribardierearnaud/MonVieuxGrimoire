const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
var passwordValidator = require('password-validator');

// Configuration de passwordValidator - On crée un schema
var schema = new passwordValidator();

// Configuration de passwordValidator - On définit les exigences pour le mot de passe
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

exports.signup = (req, res, next) => {
    // On vérifie la robustesse du mot de passe soumis
    if (schema.validate(req.body.password)) {

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
        }else{
            res.status(400).json({ message: 'Mot de passe non conforme aux critères de validation.' });
            console.log(schema.validate('joke', { list: true }));
        }
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