// bindUser.js placeholder for middlewares
module.exports = (req, res, next) => {
    // Exemple fictif : suppose qu’un user est déjà authentifié
    req.user = { id: 1, role: 'admin' };
    next();
};
