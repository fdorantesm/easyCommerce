/* eslint-disable new-cap */

import mongoose from 'mongoose';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseFindOrCreate from 'mongoose-findorcreate';

const fields = {
  key: {
    type: String,
    required: true,
    minLength: 6,
    unique: true
  },
  products: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    qty: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  type: {
    type: String,
    default: 'default'
  }
};

const options = {
  discriminatorKey: '_type',
  timestamps: true,
  strict: false
};

const Cart = new mongoose.Schema(fields, options);

Cart.plugin(mongoosePaginate);
Cart.plugin(mongooseBeautifulUniqueValidation);
Cart.plugin(mongooseFindOrCreate);

export default mongoose.model('Cart', Cart);
