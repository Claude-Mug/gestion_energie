const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/user.Controller');
const requireAuth = require('../../middlewares/requireAuth');
const authorize = require('../../middlewares/authorize');

// Routes protégées par l'authentification et l'autorisation
// Seuls les "Admin" peuvent gérer les utilisateurs
router.get('/', requireAuth, authorize('Admin'), userController.getAllUsers);
router.get('/:id', requireAuth, authorize('Admin'), userController.getUserById);
router.post('/', requireAuth, authorize('Admin'), userController.createUserByAdmin);
router.put('/:id', requireAuth, authorize('Admin'), userController.updateUserByAdmin);
router.delete('/:id', requireAuth, authorize('Admin'), userController.deleteUserByAdmin);

module.exports = router;