const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    delete req.body._id;
    console.log("Request body:", req.body.book); 
    const bookObject = JSON.parse(req.body.book);
    
    const booktoadd = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    delete booktoadd.id;
    delete booktoadd._id;
    booktoadd.ratings=[,];
    booktoadd.averageRating=0;

    console.log("bookObject: ", bookObject);
    console.log("booktoadd: ", booktoadd);

    booktoadd.save()
        .then(() => res.status(201).json({ message: 'Livre ajouté' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            console.log('Book userId:', typeof book.userId, book.userId);
            console.log('Req userId:', typeof req.auth.id, req.auth.id);
            console.log('Book Object:', bookObject);
            
            if (book.userId !== req.auth.id) {
                res.status(401).json({ message : 'Non autorisé'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };


exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.id) {
            res.status(401).json({message: 'Non autorisé'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(books => res.status(200).json(books))
    .catch(error => res.status(404).json({ error} ))
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error} ))
};

// exports.addRating = async (req, res, next) => {
//     try {
//         const userId = req.user.id;

//         // Vérifier si l'utilisateur a déjà voté pour ce livre
//         const existingRating = await Book.findOne({
//             _id: req.params.id,
//             'ratings.userId': userId
//         });

//         if (existingRating) {
//             return res.status(400).json({ message: 'Vous avez déjà voté pour ce livre.' });
//         }

//         // Si l'utilisateur n'a pas encore voté, enregistrez son vote
//         const book = await Book.findById(req.params.id);

//         if (!book) {
//             return res.status(404).json({ message: 'Livre non trouvé.' });
//         }

//         // Vérifier que la note est un entier entre 0 et 5
//         const grade = parseInt(req.body.grade);

//         if (isNaN(grade) || grade < 0 || grade > 5) {
//             return res.status(400).json({ message: 'La note doit être un entier entre 0 et 5.' });
//         }

//         // Ajouter la nouvelle note à la liste des notes du livre
//         book.ratings.push({
//             userId,
//             grade
//         });

//         // Mettre à jour la moyenne des notes du livre
//         const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
//         book.averageRating = totalRatings / book.ratings.length;

//         // Enregistrer les modifications du livre
//         await book.save();

//         res.status(201).json({ message: 'Vote ajouté avec succès.' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getBestRating = (req, res, next) => {
//     // Utiliser la méthode sort pour obtenir les livres triés par ordre décroissant de la moyenne des notes
//     Book.find().sort({ averageRating: -1 }).limit(3)
//         .then(books => res.status(200).json(books))
//         .catch(error => res.status(404).json({ error }));
// };