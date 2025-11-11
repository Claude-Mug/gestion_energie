// AdminUpload.js placeholder for class/uploads
const express = require('express');
const router = express.Router();
const upload = require('../Upload');

// Route POST /upload/admin
router.post('/upload/admin', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
    }

    res.status(200).json({
        message: 'Fichier administrateur téléchargé avec succès.',
        filename: req.file.filename,
        path: req.file.path
    });
});

module.exports = router;
