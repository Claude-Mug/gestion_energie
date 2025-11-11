const express = require('express');
const router = express.Router();
const dht11Controller = require('../../controllers/service/dht11.Controller');
// Importez vos middlewares d'authentification
const requireAuth = require('../../middlewares/requireAuth');
const authorize = require('../../middlewares/authorize'); 
const iotAuthorize = require('../../middlewares/iotAuthorize');


// Routes pour la récupération et la modification du dernier état (PLUS SPÉCIFIQUES, PLACÉES EN PREMIER)
router.get('/etat', iotAuthorize, dht11Controller.getLastEtat);
router.put('/etat', requireAuth, authorize(['Admin', 'Technicien']), dht11Controller.changeLastEtat);


// Routes CRUD pour Dht11 (MOINS SPÉCIFIQUES)
router.get('/', iotAuthorize, dht11Controller.getAllDht11);
router.get('/:id', iotAuthorize, dht11Controller.getDht11ById);
router.post('/', requireAuth, authorize(['Admin', 'Technicien']), dht11Controller.createDht11);
router.put('/:id', requireAuth, authorize(['Admin', 'Technicien']), dht11Controller.updateDht11);
router.delete('/:id', requireAuth, authorize(['Admin', 'Technicien']), dht11Controller.deleteDht11);
router.post('/data', dht11Controller.getData);
router.put('/etat/:id', requireAuth, authorize(['Admin', 'Technicien']), dht11Controller.changeEtat);


module.exports = router;
