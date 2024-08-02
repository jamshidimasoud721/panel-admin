const {Router} = require('express');
const router = new Router();

const {authenticated} = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

//* @desc :  dashboard page
//* @route : GET '/dashboard'
router.get('/dashboard', authenticated, adminController.getDashboard);

//* @desc :  dashboard addPost page
//* @route : GET '/dashboard/add-post'
router.get('/dashboard/add-post', authenticated, adminController.getAddPost);

//* @desc :  dashboard create post
//* @route : POST '/dashboard/add-post'
router.post('/dashboard/add-post', authenticated, adminController.createPost);

//* @desc :  dashboard getEditPost page
//* @route : GET '/dashboard/edit-post/:id'
router.get('/dashboard/edit-post/:id', authenticated, adminController.getEditPost);

//* @desc :  dashboard handle edit post
//* @route : POST '/dashboard/edit-post/:id'
router.post('/dashboard/edit-post/:id', authenticated, adminController.editPost);

//* @desc :  dashboard deletePost page
//* @route : GET '/dashboard/edit-post/:id'
router.get('/dashboard/delete-post/:id', adminController.deletePost);

//* @desc :  dashboard image upload
//* @route : POST '/dashboard/image-upload'
router.post('/dashboard/image-upload', authenticated, adminController.uploadImage);

//* @desc :  handle dashboard search
//* @route : POST '/dashboard/search'
router.post('/dashboard/search', authenticated, adminController.handleSearchDashboard);

module.exports = router;
