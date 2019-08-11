/* eslint-disable new-cap */

import mongoose from 'mongoose';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';

const fields = {
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  summary: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderProduct'
  }],
  status: {
    type: String,
    default: 'created'
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  gatewayCustomerId: {
    type: String
  },
  gatewayOrderId: {
    type: String
  },
  gift: {
    type: Boolean,
    default: false
  },
  bill: {
    type: Boolean,
    default: false
  },
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  deliveries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  }],
};

const options = {
  discriminatorKey: '_type',
  timestamps: true
};

const Order = new mongoose.Schema(fields, options);

Order.plugin(mongoosePaginate);
Order.plugin(mongooseBeautifulUniqueValidation);

export default mongoose.model('Order', Order);
