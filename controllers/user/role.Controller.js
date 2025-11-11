// backend/controllers/user/role.Controller.js

// Nous importons le modèle User pour accéder à la définition de l'ENUM 'role'.
// Assurez-vous que le chemin './../models/user' est correct pour votre modèle User.
// Si votre fichier de modèle User est dans un dossier 'models' et que le contrôleur est dans 'controllers',
// alors './../models' est le chemin correct pour le dossier 'models', et 'user' est le nom du fichier du modèle.
const { User } = require('../../models'); 

const getRoles = async (req, res) => {
    try {
        // La propriété 'rawAttributes' de Sequelize permet d'accéder aux définitions brutes des colonnes.
        // Pour un type DataTypes.ENUM, 'values' contient un tableau des options de l'ENUM.
        const roles = User.rawAttributes.role.values;

        // Envoyer la liste des rôles en réponse
        res.status(200).json(roles);
    } catch (error) {
        console.error("Erreur lors de la récupération des rôles:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des rôles.",
            error: error.message 
        });
    }
};

module.exports = {
    getRoles
};