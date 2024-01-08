const rateLimiter = require('express-rate-limit');

// On définit une limite pour la création de compte
const signUpLimiter = rateLimiter({
    max: 3,
    windowsMS: 10 * 60 * 1000,
    message: "Trop de requêtes, merci de réessayer ultérieurement"
})

// On définit une limite pour les tentatives d'authentification
const signInLimiter = rateLimiter({
    max: 5,
    windowsMS: 2 * 60 * 1000,
    message: "Trop de requêtes, merci de réessayer ultérieurement"
})

// On définit une limite générale pour toutes les API
const generalLimiter = rateLimiter({
    max: 100,
    windowsMS: 1000,
    message: "Trop de requêtes, merci de réessayer ultérieurement"
})

module.exports = {
    signUpLimiter,
    signInLimiter,
    generalLimiter
}