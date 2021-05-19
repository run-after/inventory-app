#! /usr/bin/env node

console.log('This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Category = require('./models/category');
var Item = require('./models/item');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

function itemCreate(manufacturer, name, description, category, price, quantity, cb) {
  itemdetail = {
    manufacturer: manufacturer,
    name: name,
    description: description,
    category: category,
    price: price,
    quantity: quantity
  }
  
  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
};

function categoryCreate(name, description, cb) {
  categorydetail = {
    name: name,
    description: description
  }
  
  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function createCategories(cb) {
  async.parallel([
    //0
    function (callback) {
      categoryCreate('Body', 'Parts to change the appearence of the bike', callback)
    },
    //1
    function (callback) {
      categoryCreate('Wheels/Tires', 'Everything related to wheels and tires', callback)
    },
    //2
    function (callback) {
      categoryCreate('Controls', 'Parts related to the handlebars and other controling parts', callback)
    },
    //3
    function (callback) {
      categoryCreate('Luggage', 'Stuff to hold your stuff', callback)
    },
    //4
    function (callback) {
      categoryCreate('Engine', 'Engine parts', callback)
    },
    //5
    function (callback) {
      categoryCreate('Protection', 'Protect your bike', callback)
    },
    //6
    function (callback) {
      categoryCreate('Seat', 'Fix where you sit', callback)
    }
  ], cb);
}

function createItems(cb) {
  async.parallel([
    function (callback) {
      itemCreate('Acerbis', '5.3 gallon Fuel tank', 'A plastic tank made by Acerbis. Larger capacity than stock, and lighter construction', categories[0], 250, 2, callback)
    },
    function (callback) {
      itemCreate('Dunlop', 'D606', 'Dunlop D606. A good set of 50/50 tires just as comfortable on the road as off. Sold as a set', categories[1], 200, 6, callback)
    },
    function (callback) {
      itemCreate('ProCycle', 'Folding gear shifter', 'Protect your cases with a folding gear shifter. Will not punch the side of your case with a tip over', categories[2], 75, 10, callback)
    },
    function (callback) {
      itemCreate('VUZ', 'Soft luggage', 'Waterproof soft bags. 30L each. Sold by the pair', categories[3], 100, 3, callback)
    },
    function (callback) {
      itemCreate('DynoJet', 'Needle kit', 'Unleash the true potential of your engine with this kit to let your bike breath',categories[4], 75, 5, callback)
    },
    function (callback) {
      itemCreate('Acerbis', 'Plastic skid plate', 'Tough ABS plastic that really protects your engine', categories[5], 85, 8, callback)
    },
    function (callback) {
      itemCreate('SeatConcepts', 'Seat kit', 'Send in your stock seat pan and we will re-foam and cover it. Wider, harder foam helps you keep sitting for longer', categories[6], 280, 1, callback)
    }
  ], cb);
}

async.series([
    createCategories,
    createItems
  ],
  // Optional callback
  function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
  });


