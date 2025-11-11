// backend/middlewares/iotAuthorize.js

const iotAuthorize = (req, res, next) => {
    console.log('--- Démarrage iotAuthorize ---');
    console.log('req.user:', req.user); // Devrait afficher l'objet utilisateur avec le rôle
    console.log('HTTP Method:', req.method); // Devrait afficher POST, PUT ou DELETE
    // Vérifier si l'utilisateur est authentifié
    // Le middleware 'requireAuth' doit s'exécuter AVANT 'iotAuthorize' pour que req.user soit disponible.
    if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Non authentifié. Veuillez vous connecter.' });
    }

    const userRole = req.user.role;
    const httpMethod = req.method;

    // Définir les rôles pour la LECTURE (GET)
    const readRoles = ['Admin', 'Technicien', 'Client', 'Observateur', 'Utilisateur'];

    // Définir les rôles pour l'ÉCRITURE / MODIFICATION / SUPPRESSION (POST, PUT, DELETE)
    const writeModifyDeleteRoles = ['Admin', 'Technicien'];

    switch (httpMethod) {
        case 'GET':
            // Tous les rôles mentionnés peuvent lire les données IoT
            if (readRoles.includes(userRole)) {
                next(); // Autorisé à lire
            } else {
                return res.status(403).json({ message: `Accès non autorisé. Votre rôle (${userRole}) ne peut pas lire ces données.` });
            }
            break;

        case 'POST':
        case 'PUT':
        case 'DELETE':
            // Seuls les Admin et Technicien peuvent modifier/créer/supprimer
            if (writeModifyDeleteRoles.includes(userRole)) {
                next(); // Autorisé à écrire/modifier/supprimer
            } else {
                return res.status(403).json({ message: `Accès non autorisé. Votre rôle (${userRole}) ne peut pas modifier ces données.` });
            }
            break;

        default:
            // Pour toute autre méthode HTTP non gérée (HEAD, OPTIONS, etc.)
            res.status(405).json({ message: 'Méthode non autorisée.' });
            break;
    }
};

module.exports = iotAuthorize;