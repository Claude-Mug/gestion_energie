const { User } = require('../../models');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs (Admin seulement)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['mot_de_passe'] } // Ne pas renvoyer les mots de passe hachés
        });
        res.status(200).json(users);
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des utilisateurs." });
    }
};

// Récupérer un utilisateur par ID (Admin seulement)
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['mot_de_passe'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de l'utilisateur." });
    }
};

// Créer un nouvel utilisateur par un Admin
const createUserByAdmin = async (req, res) => {
    try {
        const { nom, prenom, mail, role, mot_de_passe } = req.body;

        // Validation des rôles (même logique que pour l'inscription)
        const allowedRoles = User.rawAttributes.role.values;
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ message: `Rôle invalide. Les rôles autorisés sont : ${allowedRoles.join(', ')}` });
        }

        const existingUser = await User.findOne({ where: { mail } });
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà enregistré.' });
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        const newUser = await User.create({
            nom,
            prenom,
            mail,
            role: role || 'Client', // S'assurer qu'un rôle par défaut est appliqué
            mot_de_passe: hashedPassword
        });

        const userResponse = newUser.toJSON();
        delete userResponse.mot_de_passe;

        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: userResponse });
    } catch (err) {
        console.error("Erreur lors de la création de l'utilisateur par l'admin:", err);
        res.status(500).json({ error: "Erreur serveur lors de la création de l'utilisateur." });
    }
};

// Mettre à jour un utilisateur par un Admin
const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, mail, role, mot_de_passe } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Validation des rôles
        const allowedRoles = User.rawAttributes.role.values;
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ message: `Rôle invalide. Les rôles autorisés sont : ${allowedRoles.join(', ')}` });
        }

        // Hacher le nouveau mot de passe s'il est fourni
        if (mot_de_passe) {
            req.body.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
        }

        await user.update(req.body);

        const userResponse = user.toJSON();
        delete userResponse.mot_de_passe;

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès.', user: userResponse });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur par l'admin:", err);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'utilisateur." });
    }
};

// Supprimer un utilisateur par un Admin
const deleteUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        await user.destroy();
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur par l'admin:", err);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de l'utilisateur." });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin
};