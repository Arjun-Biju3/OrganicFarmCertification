const express = require('express');
const checkAuth = require('../middleware/check-auth')

const router = express.Router();
const usersControllers = require('../controllers/users-controller')




router.post('/signup',usersControllers.signup);
router.post('/login',usersControllers.login);
router.use(checkAuth);
router.get('/',usersControllers.getApplications);
router.post('/application/new',usersControllers.createApplication)
router.get('/application/:aid',usersControllers.getApplicationById)


module.exports = router;

