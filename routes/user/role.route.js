const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/user/role.Controller.js'); // Le contrôleur qui récupère l'ENUM des rôles
const requireAuth = require('../../middlewares/requireAuth'); 
const authorize = require('../../middlewares/authorize'); 


router.get('/', requireAuth, authorize(['Admin', 'Technicien']), roleController.getRoles);

// Note: Il n'y a pas de routes POST, PUT, DELETE ici car les rôles (Admin, Technicien, etc.)
// sont des valeurs fixes dans votre code (ENUM) et ne sont pas gérés via des opérations CRUD sur cette table.
// La modification du rôle d'un utilisateur individuel se fera via les routes de gestion des utilisateurs (user.route).

module.exports = router;