// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/esp-login', (req, res) => {
    const { deviceId, apiKey } = req.body;
    
    if (apiKey !== process.env.ESP32_API_KEY) {
        return res.status(401).json({ error: 'Accès non autorisé' });
    }

    // Token valide 1 an
    const token = jwt.sign(
        { deviceId, role: 'device' },
        process.env.JWT_SECRET,
        { expiresIn: '365d' }
    );

    res.json({ token });
});

module.exports = router;