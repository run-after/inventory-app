const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
const { body, validationResult } = require('express-validator');

const fs = require('fs');

const MAX_IMAGE_SIZE = 2097152;
const ALLOWED_EXT = ['image/png', 'image/jpg', 'image/jpeg'];

exports.item_create_get = function (req, res, next) {
  Category.find({}).exec(function (err, categories) {
    if (err) { return next(err); }
    res.render('item_form', { title: 'Create', categories: categories })
  });
};

exports.item_create_post = [

  body('manufacturer', 'You must give a manufacturer').trim().isLength({ min: 1 }).escape(),
  body('name', 'You must give a name').trim().isLength({ min: 1 }).escape(),
  body('description', 'You must give a description').trim().isLength({ min: 1 }).escape(),
  body('category.*').escape(),
  body('price', 'You must enter a price').trim().isInt().escape(),
  body('quantity', 'You must give a quantity').trim().isInt().escape(),
  body('image').custom((value, { req }) => {
    if (req.file.size > MAX_IMAGE_SIZE) { throw new Error('File too big - Max size 2MB') };
    if (!ALLOWED_EXT.includes(req.file.mimetype)) { throw new Error('Allowed extentions are jpeg, png, jpg') };
    return true;
  }),

  function (req, res, next) {
    const errors = validationResult(req);
    let image;
    if (req.file) {
      if (req.file.size > MAX_IMAGE_SIZE || !ALLOWED_EXT.includes(req.file.mimetype)) {
        fs.unlink('./public/images/' + req.file.originalname, (err => {
          if (err) console.log(err);
          else {
            console.log('file deleted');
          }
        }));
      } else {
        image = req.file.originalname;  
      };
    } else {
      image = undefined;
    };

    const item = new Item({
      manufacturer: req.body.manufacturer,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image: image
    });

    if (!errors.isEmpty()) {
      Category.find({}).exec(function (err, categories) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create', categories: categories, item: item, errors: errors.array() })
      });
      return;
    } else {
      item.save(function (err) {
        if (err) { return next(err); }
        res.redirect(item.url);
      });
    }
  }
];

exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id).exec(function (err, item) {
    if (err) { return next(err); }
    res.render('item_delete', { title: 'Delete item: ', item: item })
  });
};

exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.params.id).exec(function (err, item) {
    if (err) { return next(err); }
    fs.unlink('./public/images/' + item.image, () => {
      console.log('Image deleted')
    });
    res.redirect('/items');
  });
};

exports.item_update_get = function (req, res, next) {
  async.parallel({
    item: function (callback) {
      Item.findById(req.params.id).exec(callback);
    },
    categories: function (callback) {
      Category.find({}).exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.item === null) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }
    res.render('item_form', { title: 'Update', item: results.item, categories: results.categories });
  });
};

exports.item_update_post = [
  body('manufacturer', 'You must give a manufacturer').trim().isLength({ min: 1 }).escape(),
  body('name', 'You must give a name').trim().isLength({ min: 1 }).escape(),
  body('description', 'You must give a description').trim().isLength({ min: 1 }).escape(),
  body('category.*').escape(),
  body('price', 'You must enter a price').trim().isInt().escape(),
  body('quantity', 'You must give a quantity').trim().isInt().escape(),

  function (req, res, next) {
    const errors = validationResult(req);

    const item = new Item({
      manufacturer: req.body.manufacturer,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      _id: req.params.id
    });
    if (!errors.isEmpty()) {
      Category.find({}).exec(function (err, categories) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Update', categories: categories, item: item, errors: errors.array() })
      });
      return;
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err) {
        if (err) { return next(err); }
        res.redirect(item.url);
      });
    };
  }
];

exports.item_detail = function (req, res) {
  Item.findById(req.params.id).populate('category').exec(function (err, item) {
    if (err) { return next(err); }
    if (item === null) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }
    res.render('item_detail', {title: `${item.manufacturer} ${item.name}`, item: item})
  })
};

exports.item_list = function (req, res, next) {
  Item.find().sort([['name', 'ascending']]).populate('category')
    .exec(function (err, list_items) {
      if (err) { return next(err); }
      res.render('item_list', {title: 'All items', item_list: list_items})
  })
};