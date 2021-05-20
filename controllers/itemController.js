const Item = require('../models/item');

const async = require('async');
const { body, validationResult } = require('express-validator');

exports.item_create_get = function (req, res) {
  res.send('item/create(get)');
};

exports.item_create_post = function (req, res) {
  res.send('item/create(post)');
};

exports.item_delete_get = function (req, res) {
  res.send('item/:id/delete(get)');
};

exports.item_delete_post = function (req, res) {
  res.send('item/delete(post)');
};

exports.item_update_get = function (req, res) {
  res.send('item/update(get)');
};

exports.item_update_post = function (req, res) {
  res.send('item/upate(post)');
};

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
  Item.find().sort([['name', 'ascending']])
    .exec(function (err, list_items) {
      if (err) { return next(err); }
      res.render('item_list', {title: 'All items', item_list: list_items})
  })
};