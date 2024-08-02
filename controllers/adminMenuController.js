const fs = require('fs');

const multer = require("multer");
const sharp = require('sharp');
const shortid = require('shortid');
const appRoot = require('app-root-path');

const Menu = require('../models/menuModel');

const {get500} = require('./errorController');
const {formatDate} = require('../utils/jalaliMoment')
const {storage, fileFilter} = require('../utils/multer');

const getMenu = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // <-Equal-> // const page= +req.query.page // because type of page is String
    const menuPerPage = 2;

    try {
        const numberOfMenu = await Menu.find({user: req.user._id}).countDocuments();
        const menus = await Menu.find({user: req.user.id}).skip((page - 1) * menuPerPage).limit(menuPerPage);
        res.set(
            "Cache-Control",
            "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
        );
        res.render('private/menus', {
            pageTitle: 'منو',
            path: '/menu',
            layout: './layouts/dashboardLayout',
            fullName: req.user.fullName,
            menus,
            formatDate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: menuPerPage * page < numberOfMenu,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfMenu / menuPerPage)
        });

    } catch (e) {
        console.log(e);
        get500(req, res);
    }

}

const getAddMenu = (req, res) => {
    res.render('private/addMenu', {
        pageTitle: 'ساخت منو جدید',
        path: '/menu/add-menu',
        layout: './layouts/dashboardLayout',
        fullName: req.user.fullName
    })
}

const getEditMenu = async (req, res) => {
    const menu = await Menu.findOne({
        _id: req.params.id
    });

    if (!menu) {
        return res.redirect('/404');
    } else if (menu.user.toString() !== req.user._id.toString()) {
        return res.redirect('/menu');
    } else {
        res.render('private/editMenu', {
            pageTitle: 'ویرایش منو ',
            path: '/menu/edit-menu',
            layout: './layouts/dashboardLayout',
            fullName: req.user.fullName,
            menu
        })
    }
}

const editMenu = async (req, res) => {
    const errorsArray = [];
    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortid.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
    const menu = await Menu.findOne({_id: req.params.id});
    try {
        if (thumbnail.name)
            await Menu.menuValidation({...req.body, thumbnail});
        else
            await Menu.menuValidation({
                ...req.body,
                thumbnail: {
                    name: "placeholder",
                    size: 0,
                    mimetype: "image/jpeg",
                },
            });
        if (!menu) {
            return res.redirect("/404");
        }
        if (menu.user.toString() !== req.user._id.toString()) {
            return res.redirect("/menu");
        } else {
            if (thumbnail.name) {
                fs.unlink(`${appRoot}/public/uploads/thumbnails/${menu.thumbnail}`, async (err) => {
                        if (err) console.log(err);
                        else {
                            await sharp(thumbnail.data).jpeg({quality: 60}).toFile(uploadPath).catch((err) => console.log(err));
                        }
                    }
                );
            }
            const {title, subMenu, body} = req.body;
            menu.title = title;
            menu.subMenu = subMenu;
            menu.body = body;
            menu.thumbnail = thumbnail.name ? fileName : menu.thumbnail;
            await menu.save();
            return res.redirect("/menu");
        }
    } catch (e) {
        console.log(e);
        e.inner.forEach((error) => {
            errorsArray.push({
                name: error.path,
                message: error.message
            });
        });
        res.render("private/editMenu", {
            pageTitle: " ویرایش منو",
            path: "/menu/edit-menu",
            layout: "./layouts/dashboardLayout",
            fullName: req.user.fullName,
            errors: errorsArray,
            menu,
        });
    }
};

const deleteMenu = async (req, res) => {
    try {
        const result = await Menu.findByIdAndRemove(req.params.id);
        // console.log(result);
        res.redirect('/menu');
    } catch (e) {
        console.log(e);
        get500(req, res);
    }
}

const createMenu = async (req, res) => {
    const errorsArray = [];

    /*---upload pic thumbnail---*/
    const thumbnail = req.files ? req.files.thumbnail : {};
    // console.log(thumbnail);
    const fileName = `${shortid.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
    /*---upload pic thumbnail---*/

    try {
        req.body = {...req.body, thumbnail}
        // console.log(req.body);
        await Menu.menuValidation(req.body);
        await sharp(thumbnail.data).jpeg({quality: 60}).toFile(uploadPath).catch(err => console.log(err));
        await Menu.create({
            // ...req.body  -> this is spread operator
            title: req.body.title,
            subMenu: req.body.subMenu,
            user: req.user.id,
            thumbnail: fileName
        })
        res.redirect('/menu');
    } catch (e) {
        console.log(e);
        // get500(req, res);
        e.inner.forEach((error) => {
            errorsArray.push({
                name: error.path,
                message: error.message
            });
        });
        res.render('private/addMenu', {
            pageTitle: 'ساخت منو جدید',
            path: '/menu/add-menu',
            layout: './layouts/dashboardLayout',
            fullName: req.user.fullName,
            errors: errorsArray
        })

    }
}

const handleSearchMenu = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // <-Equal-> // const page= +req.query.page // because type of page is String
    const menuPerPage = 2;

    try {
        const numberOfMenu = await Menu.find(
            {
                user: req.user._id,
                $text: {
                    $search: req.body.search
                }
            }
        ).countDocuments();
        const menus = await Menu.find(
            {
                user: req.user.id,
                $text: {
                    $search: req.body.search
                }
            }
        ).skip((page - 1) * menuPerPage).limit(menuPerPage);

        res.render('private/blogs', {
            pageTitle: 'منو',
            path: '/menu',
            layout: './layouts/dashboardLayout',
            fullName: req.user.fullName,
            menus,
            formatDate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: menuPerPage * page < numberOfMenu,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfMenu / menuPerPage)
        });

    } catch (e) {
        console.log(e);
        get500(req, res);
    }

}


module.exports = {
    getMenu,
    getAddMenu,
    createMenu,
    // uploadImage,
    editMenu,
    getEditMenu,
    deleteMenu,
    handleSearchMenu
}
