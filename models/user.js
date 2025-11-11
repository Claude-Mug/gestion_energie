const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize'); // Assurez-vous que ce chemin est correct

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // <-- On garde uniquement celui-ci
        validate: {
            isEmail: true
        }
    },
    role: {
        // Définir ici les 5 rôles que vous souhaitez
        type: DataTypes.ENUM('Admin', 'Technicien', 'Client', 'Observateur', 'Utilisateur'), // Exemple de 5 rôles
        defaultValue: 'Utilisateur', // Rôle par défaut si non spécifié lors de l'inscription
        allowNull: false
    },
    mot_de_passe: { // Renommé de 'password' pour correspondre à votre demande
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'utilisateurs', // Nom de la table dans la base de données
    timestamps: true // Ajoute createdAt et updatedAt
});

module.exports = User;