const express = require('express');
const router = express.Router();
const actionneursController = require('../../controllers/service/actionneurs.Controller');
// Importez vos middlewares d'authentification
const requireAuth = require('../../middlewares/requireAuth');
const authorize = require('../../middlewares/authorize'); 
const iotAuthorize = require('../../middlewares/iotAuthorize');


// Routes pour la récupération et la modification du dernier état par type (PLUS SPÉCIFIQUES, PLACÉES EN PREMIER)
// GET /api/actionneurs/etat?type=led_lr
router.get('/etat', iotAuthorize, actionneursController.getLastEtat); 
// PUT /api/actionneurs/etat (avec { type: 'led_lr', etat: 1 } dans le body)
router.put('/etat', requireAuth, authorize(['Admin', 'Technicien']), actionneursController.changeLastEtat); 


// Routes CRUD standard (MOINS SPÉCIFIQUES)
router.get('/', iotAuthorize, actionneursController.getAllActionneurs);
router.get('/:id', iotAuthorize, actionneursController.getActionneursById);
router.post('/', requireAuth, authorize(['Admin', 'Technicien']), actionneursController.createActionneurs);
router.put('/:id', requireAuth, authorize(['Admin', 'Technicien']), actionneursController.updateActionneurs);
router.delete('/:id', requireAuth, authorize(['Admin', 'Technicien']), actionneursController.deleteActionneurs);

// Route pour recevoir les données du microcontrôleur (si applicable)
router.post('/data', actionneursController.getData);

// Route pour changer l'état d'un enregistrement spécifique par ID (si applicable)
router.put('/change-etat/:id', requireAuth, authorize(['Admin', 'Technicien']), actionneursController.changeEtat);


module.exports = router;
