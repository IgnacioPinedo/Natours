const express = require('express');

const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', /* bookingController.createBookingCheckout, */ authController.isLoggedIn, viewController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/login', viewController.getLoginForm);

router.get('/signup', viewController.getSignUpForm);

router.get('/forgot', viewController.getForgotForm);

router.get('/reset', viewController.getResetForm);

router.get('/me', authController.protect, viewController.getAccount);

router.get('/my-tours', authController.protect, viewController.getMyTours);

router.get('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;
