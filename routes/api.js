const express = require('express');
const router = express.Router();
const userController = require('./../controllers/UserController');
const Middleware = require('./../controllers/Middleware');


router.get('/users', userController.users);

router.post('/update', Middleware.withAuth, userController.update);

// User Verify
router.get('/verify', Middleware.withAuth, userController.verifyUser);
router.get('/logout', Middleware.withAuth, userController.logout);


// Twitter Login
router.get('/twitter/auth', userController.requestToken);
router.get('/twitter/verify', userController.verifyToken);


module.exports = router;