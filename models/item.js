const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    manufacturer: {type: String, required: true, maxLength: 100},
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 1000 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }
);

ItemSchema.virtual('url').get(function () {
  return '/item/' + this._id
});

module.exports = mongoose.model('Item', ItemSchema);