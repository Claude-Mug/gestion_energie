// backend/controllers/auth/auth.Controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models'); // Assurez-vous que le chemin est correct pour votre modèle User
require('dotenv').config(); // Pour charger les variables d'environnement (ex: JWT_SECRET)

// Récupère la clé secrète JWT depuis les variables d'environnement.
// Utilisez une clé forte et complexe en production !
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_please_change_this_in_production';

/**
 * Gère l'inscription d'un nouvel utilisateur.
 * Hache le mot de passe et crée un nouvel enregistrement dans la base de données.
 */
const register = async (req, res) => {
    try {
        const { nom, prenom, mail, role, mot_de_passe } = req.body;

        // Validation de base des champs requis.
        if (!mail || !mot_de_passe || !nom || !prenom) {
            return res.status(400).json({ message: 'Veuillez fournir tous les champs requis (nom, prenom, email, mot de passe).' });
        }

        // Vérifie si le rôle fourni est une valeur valide de l'ENUM définie dans le modèle User.
        const allowedRoles = User.rawAttributes.role.values;
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ message: `Rôle invalide. Les rôles autorisés sont : ${allowedRoles.join(', ')}` });
        }

        // Vérifie si un utilisateur avec cet email existe déjà pour éviter les doublons.
        const existingUser = await User.findOne({ where: { mail } });
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
        }

        // Hache le mot de passe fourni par l'utilisateur avant de le stocker.
        // Le '10' est le "salt rounds", un nombre plus élevé rend le hachage plus sûr mais plus lent.
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Crée le nouvel utilisateur dans la base de données.
        const newUser = await User.create({
            nom,
            prenom,
            mail,
            role: role || 'Utilisateur', // Assigne le rôle fourni ou 'Utilisateur' par défaut.
            mot_de_passe: hashedPassword // Stocke le mot de passe haché.
        });

        // Prépare l'objet utilisateur à renvoyer dans la réponse en excluant le mot de passe haché.
        const userResponse = newUser.toJSON();
        delete userResponse.mot_de_passe;

        // Renvoie une réponse de succès avec le statut 201 (Created) et les informations de l'utilisateur.
        res.status(201).json({ message: 'Utilisateur enregistré avec succès.', user: userResponse });
    } catch (err) {
        console.error("Erreur d'inscription:", err);
        // Gère spécifiquement l'erreur de contrainte unique de Sequelize si l'email est déjà pris.
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
        }
        // Gère toute autre erreur serveur inattendue.
        res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
    }
};

/**
 * Gère la connexion d'un utilisateur existant.
 * Vérifie les identifiants et génère un token JWT en cas de succès.
 */
const login = async (req, res) => {
    try {
        const { mail, mot_de_passe } = req.body;

        // Validation de base des champs de connexion.
        if (!mail || !mot_de_passe) {
            return res.status(400).json({ message: 'Veuillez fournir email et mot de passe.' });
        }

        // Cherche l'utilisateur dans la base de données par son email.
        const user = await User.findOne({ where: { mail } });
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Compare le mot de passe fourni avec le mot de passe haché stocké.
        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Crée un JSON Web Token (JWT) contenant l'ID, l'email et le rôle de l'utilisateur.
        // Le token est signé avec JWT_SECRET et expire après 1 heure.
        const token = jwt.sign(
            { id: user.id, mail: user.mail, role: user.role }, // Payload du token (informations sur l'utilisateur)
            JWT_SECRET, // Clé secrète pour signer le token
            { expiresIn: '1h' } // Options du token (expiration)
        );

        // Prépare l'objet utilisateur à renvoyer dans la réponse en excluant le mot de passe haché.
        const userResponse = user.toJSON();
        delete userResponse.mot_de_passe;

        // Renvoie une réponse de succès avec le statut 200 (OK), le token JWT et les informations de l'utilisateur.
        res.status(200).json({ message: 'Connexion réussie.', token, user: userResponse });
    } catch (err) {
        console.error("Erreur de connexion:", err);
        res.status(500).json({ error: "Erreur serveur lors de la connexion." });
    }
};

// Exporte les fonctions pour qu'elles puissent être utilisées par les routes.
module.exports = {
    register,
    login
};
