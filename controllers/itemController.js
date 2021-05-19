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
  res.send('item(get)');
};

exports.item_list = function (req, res) {
  res.send('item list')
};