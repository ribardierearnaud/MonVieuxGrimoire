# Mon Projet

Ce projet a été réalisé dans le cadre du parcours OpenClassRooms Développeur Web et il permet de gérer le backend d'un site de gestion de livres. Il utilise Node.js, Express, MongoDB, Multer et Sharp.
Il nécessite d'utiliser le frontend du projet fourni par OpenClassRooms ici :
```
https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres
```

## Table des matières

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Création d'un compte utilisateur](#création-des-utilisateurs)

## Installation

Assurez-vous d'avoir Node.js et npm installés sur votre machine.

1. Clonez le projet sur votre machine.
2. Installez les dépendances avec la commande suivante :

```
npm install
```

3. Disposer d'une base de données MongoDB
4. Compléter le fichier .env à l'aide de l'exemple fourni

## Utilisation

Pour lancer l'application faites la commande :

```
npm start
```

Le backend sera accessible à l'adresse [http://localhost:4000](http://localhost:4000).
Par défaut, le frontend est lui accessible à l'adresse [http://localhost:3000](http://localhost:3000)


## Création des utilisateurs

Lors de la création d'un compte, le mot de passe doit vérifier les règles suivantes :
 - minimum 8 caractères
 - maximum 100 caractères
 - doit contenir au moins une majuscule
 - doit contenir au moins une minuscule
 - doit avoir au moins 2 chiffres
 - ne doit pas contenir d'espace
 - doit être différent de 'Passw0rd' ou 'Password123'
