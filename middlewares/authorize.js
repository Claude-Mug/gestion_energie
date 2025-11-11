const authorize = (roles = []) => {
    // Permet d'accepter un seul rôle ou un tableau de rôles
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // S'assurer que req.user est défini par le middleware requireAuth
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Accès non autorisé: Informations utilisateur manquantes.' });
        }

        // Vérifier si le rôle de l'utilisateur est inclus dans les rôles autorisés
        if (roles.length && !roles.includes(req.user.role)) {
            // Rôle non autorisé
            return res.status(403).json({ message: 'Accès interdit: Vous n\'avez pas le rôle requis.' });
        }

        // Le rôle est autorisé, passer à la suite
        next();
    };
};

module.exports = authorize;