// backend/models/index.js
const sequelize = require('../utils/sequerize'); // Votre instance Sequelize

// Importez vos modèles ici
const Ultrasonic = require('./ultrasonic');
const Pir = require('./pir');
const Dht11 = require('./dht11');
const Ldr = require('./ldr');
const Actionneur = require('./actionneurs');
const User = require('./user');

// Exportez tous vos modèles
module.exports = {
    sequelize,
    Ultrasonic,
    Pir,
    Dht11,
    Ldr,
    Actionneur, // Si vous l'avez
    User, // <-- Ajoutez cette ligne
};