const rateLimiter = require('express-rate-limit');

const signUpLimiter = rateLimiter({
    max: 3,
    windowsMS: 10 * 60 * 1000,
    message: "Trop de requêtes, merci de réessayer ultérieurement"
})

const signInLimiter = rateLimiter({
    max: 5,
    windowsMS: 10 * 60 * 1000,
    message: "Trop de requêtes, merci de réessayer ultérieurement"
})

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