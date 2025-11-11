const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');

const Actionneurs = sequelize.define('Actionneurs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    led_lr: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Valeur par défaut
    },
    led_lb: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Valeur par défaut
    },
    led_lw: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Valeur par défaut
    },
    led_lj: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Valeur par défaut
    },
    moteur: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Valeur par défaut
    },
    buzzer: { // Ajout du champ buzzer (si présent dans votre DB)
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Valeur par défaut
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'N/A' // Valeur par défaut
    },
    zone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Global' // Valeur par défaut
    },
    datetime: { // Ajout du champ datetime (si présent dans votre DB)
        type: DataTypes.DATE,
        allowNull: true, // Ou false si vous voulez qu'il soit toujours présent
        defaultValue: DataTypes.NOW // Valeur par défaut à la date/heure actuelle
    }
}, {
    tableName: 'actionneurs',
    timestamps: false // Maintenu à false, car vous avez votre propre champ datetime
});

module.exports = Actionneurs;
