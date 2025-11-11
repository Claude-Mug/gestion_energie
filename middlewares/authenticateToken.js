// middlewares/authenticateToken.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    // Vérifier l'API Key ESP en premier
    const apiKey = req.headers['x-esp-api-key'];
    
    if (apiKey && apiKey === process.env.ESP32_API_KEY) {
        console.log("Authentification ESP réussie via API Key");
        req.device = { type: 'ESP32' };
        return next();
    }

    // Sinon vérifier le JWT
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Erreur de vérification du token:', err);
            return res.status(403).json({ message: 'Token invalide ou expiré' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
