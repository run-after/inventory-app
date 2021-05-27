const express = require('express');
const router = express.Router();

const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({
  storage: storage
})

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

/* GET home page. */
router.get('/', category_controller.index);

// GET request for creating category
router.get('/category/create', category_controller.category_create_get);

// POST request for creating category
router.post('/category/create', category_controller.category_create_post);

// GET request for deleting category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request for deleting category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request for updating category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request for updating category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all categories
router.get('/categories', category_controller.category_list);

// ITEM ROUTES //

// GET request for creating Item.
router.get('/item/create', item_controller.item_create_get);

// POST request for creating Item.
router.post('/item/create', upload.single('uploaded_file'), item_controller.item_create_post);

// GET request to delete Item.
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete Item.
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update Item
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update Item
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one item.
router.get('/item/:id', item_controller.item_detail);

// GET reqest for list of all items
router.get('/items', item_controller.item_list);

module.exports = router;