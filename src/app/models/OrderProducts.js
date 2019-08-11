/* eslint-disable new-cap */

import mongoose from 'mongoose';

const fields = {
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  qty: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
};

const options = {
  collection: 'orderProducts'
};

const OrderProduct = new mongoose.Schema(fields, options);

export default mongoose.model('OrderProduct', OrderProduct);
