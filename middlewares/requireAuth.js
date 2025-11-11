const jwt = require('jsonwebtoken');
require('dotenv').config(); // Pour accéder à process.env.JWT_SECRET

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'; // Doit correspondre à celui utilisé pour signer le token

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès non autorisé. Token manquant ou mal formaté.' });
    }

    const token = authHeader.split(' ')[1]; // Récupère le token après "Bearer "

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken; // Ajoute les informations de l'utilisateur décodées à l'objet de requête
        next(); // Passe au middleware/route suivant
    } catch (err) {
        console.error("Erreur de vérification du token:", err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré.' });
        }
        res.status(401).json({ message: 'Token invalide.' });
    }
};

module.exports = requireAuth;