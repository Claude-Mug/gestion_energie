const express = require('express');
const router = express.Router();
const ldrController = require('../../controllers/service/ldr.Controller');
// Importez vos middlewares d'authentification
const requireAuth = require('../../middlewares/requireAuth');
const authorize = require('../../middlewares/authorize'); 
const iotAuthorize = require('../../middlewares/iotAuthorize');


// Routes pour la récupération et la modification du dernier état (PLUS SPÉCIFIQUES, PLACÉES EN PREMIER)
router.get('/etat', iotAuthorize, ldrController.getLastEtat);
router.put('/etat', requireAuth, authorize(['Admin', 'Technicien']), ldrController.changeLastEtat);


// Routes CRUD pour Ldr (MOINS SPÉCIFIQUES)
router.get('/', iotAuthorize, ldrController.getAllLdr);
router.get('/:id', iotAuthorize, ldrController.getLdrById);
router.post('/', requireAuth, authorize(['Admin', 'Technicien']), ldrController.createLdr);
router.put('/:id', requireAuth, authorize(['Admin', 'Technicien']), ldrController.updateLdr);
router.delete('/:id', requireAuth, authorize(['Admin', 'Technicien']), ldrController.deleteLdr);
router.post('/data', ldrController.getData);
router.put('/etat/:id', requireAuth, authorize(['Admin', 'Technicien']), ldrController.changeEtat);


module.exports = router;
