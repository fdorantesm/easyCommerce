/* eslint-disable new-cap */
import mongoose from 'mongoose';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseSoftdelete from 'mongoose-softdelete';

const fields = {
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: String
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  deleted: {
    type: Boolean,
    default: false
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
};

const options = {
  discriminatorKey: '_type',
  timestamps: true
};

const Product = new mongoose.Schema(fields, options);

Product.plugin(mongoosePaginate);
Product.plugin(mongooseBeautifulUniqueValidation);
Product.plugin(mongooseSoftdelete);

export default mongoose.model('Product', Product);
