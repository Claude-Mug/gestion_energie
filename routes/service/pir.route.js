const express = require('express');
const router = express.Router();
const pirController = require('../../controllers/service/pir.Controller');
// Importez vos middlewares d'authentification
const requireAuth = require('../../middlewares/requireAuth');
const authorize = require('../../middlewares/authorize'); 
const iotAuthorize = require('../../middlewares/iotAuthorize');


// Routes pour la récupération et la modification du dernier état (PLUS SPÉCIFIQUES, PLACÉES EN PREMIER)
router.get('/etat', iotAuthorize, pirController.getLastEtat);
router.put('/etat', requireAuth, authorize(['Admin', 'Technicien']), pirController.changeLastEtat);


// Routes CRUD pour Pir (MOINS SPÉCIFIQUES)
router.get('/', iotAuthorize, pirController.getAllPir);
router.get('/:id', iotAuthorize, pirController.getPirById);
router.post('/', requireAuth, authorize(['Admin', 'Technicien']), pirController.createPir);
router.put('/:id', requireAuth, authorize(['Admin', 'Technicien']), pirController.updatePir);
router.delete('/:id', requireAuth, authorize(['Admin', 'Technicien']), pirController.deletePir);
router.post('/data', pirController.getData);
router.put('/etat/:id', requireAuth, authorize(['Admin', 'Technicien']), pirController.changeEtat);


module.exports = router;
