const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authenticateJWT = require('../middleware/authMiddleware');

// Routes for Store
router.post('/',authenticateJWT , storeController.createStore);
router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);
router.put('/:id',authenticateJWT, storeController.updateStore);
router.delete('/:id',authenticateJWT, storeController.deleteStore);

module.exports = router;
