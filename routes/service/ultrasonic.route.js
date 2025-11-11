const express = require('express');
const router = express.Router();
const ultrasonicController = require('../../controllers/service/ultrasonic.Controller');
// NOUVELLE LIGNE : Importez vos middlewares d'authentification
// Middlewares customs
const requireAuth = require('../../middlewares/requireAuth');
const authorize = require('../../middlewares/authorize'); 
const iotAuthorize = require('../../middlewares/iotAuthorize');


// Routes pour la récupération du dernier état (PLUS SPÉCIFIQUES, PLACÉES EN PREMIER)
// GET /api/ultrasonic/etat
router.get('/etat', iotAuthorize, ultrasonicController.getLastEtat); // Ajout de iotAuthorize
// PUT /api/ultrasonic/etat (pour changer le dernier enregistrement global, utilisé par le dashboard)
router.put('/etat', requireAuth, authorize(['Admin', 'Technicien']), ultrasonicController.changeLastEtat); // Ajout de middlewares


// Routes CRUD standard (MOINS SPÉCIFIQUES)
// GET /api/ultrasonic
router.get('/', iotAuthorize, ultrasonicController.getAllUltrasonic); // Ajout de iotAuthorize
// GET /api/ultrasonic/:id
router.get('/:id', iotAuthorize, ultrasonicController.getUltrasonicById); // Ajout de iotAuthorize
// POST /api/ultrasonic
router.post('/', requireAuth, authorize(['Admin', 'Technicien']), ultrasonicController.createUltrasonic);
// PUT /api/ultrasonic/:id
router.put('/:id', requireAuth, authorize(['Admin', 'Technicien']), ultrasonicController.updateUltrasonic);
// DELETE /api/ultrasonic/:id
router.delete('/:id', requireAuth, authorize(['Admin', 'Technicien']), ultrasonicController.deleteUltrasonic);
// Route pour recevoir les données du microcontrôleur (souvent sans auth ou avec une clé API spécifique)
// POST /api/ultrasonic/data
router.post('/data', ultrasonicController.getData); 
// Route pour changer l'état d'un enregistrement spécifique par ID
// PUT /api/ultrasonic/etat/:id
router.put('/etat/:id', requireAuth, authorize(['Admin', 'Technicien']), ultrasonicController.changeEtat);


module.exports = router;
