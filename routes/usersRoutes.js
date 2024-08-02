const {Router} = require('express');

const router = new Router();

const userController = require('../controllers/userController');
const {authenticated} = require('../middlewares/auth');


//* @desc :  login page
//* @route : GET '/admin/login'
router.get('/login', userController.login);

//* @desc :  login handle
//* @route : POST '/admin/login'
router.post("/login", userController.handleLogin, userController.rememberMe);

//* @desc :  logout
//* @route : GET '/admin/logout'
router.get("/logout", authenticated, userController.logout);

//* @desc :  register page
//* @route : GET '/admin/register'
router.get('/register', userController.register);

//* @desc :  register handle
//* @route : POST '/admin/register'
router.post('/register', userController.createUser);

//* @desc :  forgetPassword page
//* @route : GET '/admin/forget-password'
router.get('/forget-password', userController.forgetPassword);

//* @desc :  forgetPassword page
//* @route : POST '/admin/forget-password/'
router.post('/forget-password', userController.handleForgetPassword);

//* @desc :  resetPassword page
//* @route : GET '/admin/reset-password/:token'
router.get('/reset-password/:token', userController.resetPassword);

//* @desc :  resetPassword page
//* @route : POST '/admin/reset-password/:id'
router.post('/reset-password/:id', userController.handleResetPassword);

module.exports = router;
