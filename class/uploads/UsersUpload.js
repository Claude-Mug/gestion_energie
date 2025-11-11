const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');

router.post('/upload/user', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    res.status(200).json({
        message: 'Upload réussi ',
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
    });
});

module.exports = router;
