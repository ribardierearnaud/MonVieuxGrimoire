const Book = require('../models/Book');
const fs = require('fs');

// Fonction de création d'un livre
exports.createBook = (req, res, next) => {
    delete req.body._id;
    const bookObject = JSON.parse(req.body.book);
    
    const booktoadd = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    delete booktoadd.id;
    delete booktoadd._id;

    /// On force les valeurs de rating et rating moyen à null et 0
    booktoadd.ratings=[];
    booktoadd.averageRating=0;


    // On sauvegarde le livre dans la base de données mongoDB
    booktoadd.save()
        .then(() => res.status(201).json({ message: 'Livre ajouté' }))
        .catch(error => res.status(400).json({ error }));
};

// Fonction de modification d'un livre
exports.modifyBook = (req, res, next) => {
    // On vérifie s'il y a une image à modifier ou non
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    // On supprime l'information transmise de l'userID pour vérifier si l'émetteur de la requête est bien l'auteur du livre
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {

            // On vérifie si le livre existe
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé.' });
            }
                    
            // On vérifie si l'utilisateur est l'auteur du livre
            if (book.userId !== req.auth.id) {
                res.status(401).json({ message : 'Non autorisé'});
            } else {

                // On récupère le nom du fichier de l'image précédente
                const previousFilename = book.imageUrl.split('/images/')[1];

                // On supprime la précédente image du serveur
                fs.unlink(`images/${previousFilename}`, () => {
                    Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Livre modifié!'}))
                    .catch(error => res.status(401).json({ error }));
                } );
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

// Fonction de suppression d'un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {

        // On vérifie que le demandeur est bien le propriétaire du livre (celui qui l'a créé en base de données)
        if (book.userId != req.auth.id) {
            res.status(401).json({message: 'Non autorisé'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];

            // On supprime l'image sur le serveur
            fs.unlink(`images/${filename}`, () => {
                // On supprime l'objet en base de données
                Book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });};

// Fonction pour afficher un livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error} ))
};

// Fonction pour afficher tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error} ))
};

exports.addRating = (req, res, next) => {
    // Rechercher le livre
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // On vérifie si l'utilisateur a déjà voté pour ce livre
            const alreadyRated = book.ratings.some(rating => rating.userId === req.auth.id);

            if (alreadyRated) {
                return res.status(403).json({ message: 'Vous avez déjà voté pour ce livre.' });
            }

            // On vérifie que la note est un entier entre 0 et 5
            const grade = parseInt(req.body.rating);
            if (isNaN(grade) || grade < 0 || grade > 5) {
                return res.status(400).json({ message: 'La note doit être un entier entre 0 et 5.' });
            }

            // On ajoute la nouvelle note à la liste des notes du livre
            book.ratings.push({
                userId: req.auth.id,
                grade: grade
            });

            // On met à jour la moyenne des notes du livre
            const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
            book.averageRating = totalRatings / book.ratings.length;

            // On sauvegarde les modifications du livre
            book.save()
                .then(() => res.status(201).json(book))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};


// Fonction pour lister les 3 livres ayant la meilleure note moyenne
exports.getBestRating = (req, res, next) => {
    // On utilise la méthode sort pour obtenir les livres triés par ordre décroissant de la moyenne des notes
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
}; 