const express = require('express');

const router = express.Router();
const inspectorControllers = require('../controllers/inspector-controller')
const checkAuth = require('../middleware/check-auth')





router.use(checkAuth);
router.get('/details/:appId',inspectorControllers.getDetailsById);
router.get('/applications/all',inspectorControllers.getApplications);
router.patch('/changeStatus/:appId',inspectorControllers.updateStatus);
router.get('/searchResult/:fieldId',inspectorControllers.getDetailsByFieldId);



module.exports = router;
