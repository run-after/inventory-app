const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');
const { body, validationResult } = require('express-validator');

// NEED TO CHANGE THIS
exports.index = function (req, res) {
  res.render('index', { title: 'Inventory' });
};

exports.category_create_get = function (req, res) {
  res.render('category_form', { title: 'Create Category' });
};

exports.category_create_post = [
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('category_form', { title: 'Create Category', category: category, errors: errors.array() });
      return;
    } else {
      Category.findOne({ 'name': req.body.name }).exec((err, found_category) => {
        if (err) { return next(err); }
        if (found_category) {
          res.redirect(found_category.url);
        } else {
          category.save(function (err) {
            if (err) { return next(err); }
            res.redirect(category.url);
          });
        };
      });
    };
  }
];

exports.category_delete_get = function (req, res, next) {
  async.parallel({
    category: function (callback) {
      Category.findById(req.params.id).exec(callback)
    },
    category_items: function (callback) {
      Item.find({ 'category': req.params.id }).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.category === null) {
      res.redirect('categories');
    };
    res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items })
  });
};

exports.category_delete_post = function (req, res, next) {
  async.parallel({
    category: function (callback) {
      Category.findById(req.body.categoryid).exec(callback)
    },
    category_items: function (callback) {
      Item.find({ 'category': req.body.categoryid }).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.category_items.length > 0) {
      res.render('category_delete', 'Delete Category', { category: results.category, category_items: results.category_items });
      return;
    } else {
      Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
        if (err) { return next(err); }
        res.redirect('/categories');
      });
    };
  });
};

exports.category_update_get = function (req, res) {
  res.send('category/update (get)')
};

exports.category_update_post = function (req, res) {
  res.send('category/update (post)')
};

exports.category_detail = function (req, res, next) {
  async.parallel({
    category: function (callback) {
      Category.findById(req.params.id).exec(callback);
    },
    category_items: function (callback) {
      Item.find({ 'category': req.params.id }).exec(callback);
    },
  },function (err, results) {
    if (err) { return next(err); }
    if (results.category == null) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category_detail', { title: results.category.name, category: results.category, items: results.category_items });
  });
};

exports.category_list = function (req, res) {
  Category.find().sort([['name', 'ascending']])
    .exec(function (err, list_categories) {
      if (err) { return async.nextTick(err) };
      res.render('category_list', { title: 'Category List', category_list: list_categories })
    });
};