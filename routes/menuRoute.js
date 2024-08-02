const {Router} = require('express');
const router = new Router();

const {authenticated} = require('../middlewares/auth');
const adminMenuController = require('../controllers/adminMenuController');

//* @desc :  dashboard page
//* @route : GET '/dashboard'
router.get('/menu', authenticated, adminMenuController.getMenu);

//* @desc :  dashboard addPost page
//* @route : GET '/dashboard/add-post'
router.get('/menu/add-menu', authenticated, adminMenuController.getAddMenu);

//* @desc :  menu create menu
//* @route : POST '/menu/add-menu'
router.post('/menu/add-menu', authenticated, adminMenuController.createMenu);

//* @desc :  menu getEditPost page
//* @route : GET '/menu/edit-menu/:id'
router.get('/menu/edit-menu/:id', authenticated, adminMenuController.getEditMenu);

//* @desc :  menu handle edit post
//* @route : POST '/menu/edit-menu/:id'
router.post('/menu/edit-menu/:id', authenticated, adminMenuController.editMenu);

//* @desc :  menu deleteMenu page
//* @route : GET '/dashboard/edit-post/:id'
router.get('/menu/delete-menu/:id', adminMenuController.deleteMenu);

//* @desc :  menu image upload
//* @route : POST '/menu/image-upload'
// router.post('/image-upload', authenticated, adminMenuController.uploadImage);

//* @desc :  handle menu search
//* @route : POST '/menu/search'
router.post('/menu/search', authenticated, adminMenuController.handleSearchMenu);

module.exports = router;
