const express = require('express');
const checkAuth = require('../middleware/check-auth')

const router = express.Router();
const certifierControllers = require('../controllers/certifier-controller')

router.use(checkAuth);
router.get('/applications/all',certifierControllers.getApplications);
router.get('/details/:appId',certifierControllers.getDetailsById);
router.patch('/changeStatus/:appId',certifierControllers.updateStatus);

module.exports = router;

