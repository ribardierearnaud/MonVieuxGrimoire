const express = require('express');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/book');

mongoose.connect('mongodb+srv://arnaudribardiere:XAZ2iNu18b2yeUTw@cluster0.uqyafzw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/auth/signup', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
     message:  'utilisateur créé !'
    })
});

app.use('/api/books', bookRoutes);

// app.get('/api/auth/signup', (req, res, next) => {
//     const signup = [
//         {
//             _id: 'oeihfzeoi',
//             email: 'admin@mvg.fr',
//             password: 'mvg',
//         },
//         {
//             _id: 'dsdsdqzde',
//             email: 'arnaud@mvg.fr',
//             password: 'arnaud',
//         },
//     ];
//     res.status(200).json(signup);
// });

app.post('/api/auth/login', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
     message:  'utilisateur créé !'
    })
});

// app.get('/api/auth/login', (req, res, next) => {
//     const login = [
//         {
//             _id: 'oeihfzeoi',
//             email: 'admin@mvg.fr',
//             password: 'mvg',
//         },
//         {
//             _id: 'dsdsdqzde',
//             email: 'arnaud@mvg.fr',
//             password: 'arnaud',
//         },
//     ];
//     res.status(200).json(login);
// });



// app.get('/api/books', (req, res, next) => {
// const books = [
//     {
//         userId:'azazezae',
//         title: 'Mémoire de fille',
//         author: 'Annie Ernaux',
//         imageURL: 'https://m.media-amazon.com/images/I/81lEpHhyc-L._SL800_.jpg',
//         year: 2016,
//         genre: 'Autobiographie',
//         ratings: [
//             {
//             userId: 'dsdsdqzde',
//             grade: 5,
//             }
//         ],
//         averagerating: 5,
//     },
//     {
//         userId:'dsdsdqzde',
//         title: 'Mon second livre',
//         author: 'Stephan King',
//         imageURL: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//         year: 2023,
//         genre: 'Heroic-Fantaise',
//         ratings: [
//             {
//             userId: 'dsdsdqzde',
//             grade: 5,
//             }
//         ],
//         averagerating: 5,
//     }
// ];
// res.status(200).json(books);
// });


module.exports = app;