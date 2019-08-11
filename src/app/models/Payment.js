/* eslint-disable new-cap */

import mongoose from 'mongoose';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';

const fields = {
  amount: {
    type: Number,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  status: {
    type: String,
    default: 'created'
  },
  method: {
    type: String,
    required: true
  },
  // Offline payments
  reference: {
    type: String
  },
  receivingAccountBank: {
    type: String
  },
  receivingAccountNumber: {
    type: String
  },
  clabe: {
    type: String
  },
  referenceExpiration: {
    type: Date
  },
  paidAt: {
    type: Date
  },
  // refunds
  refunded: {
    type: Boolean,
    default: false
  },
  refundAmount: {
    type: Number
  },
  refundedAt: {
    type: Date
  },
  gatewayPaymentId: {
    type: String
  },
  gatewayChargeId: {
    type: String
  },
  currency: {
    type: String,
    default: 'MXN'
  },
  fee: {
    type: Number
  }
};

const options = {
  timestamps: true
};

const Payment = new mongoose.Schema(fields, options);

Payment.plugin(mongoosePaginate);
Payment.plugin(mongooseBeautifulUniqueValidation);

export default mongoose.model('Payment', Payment);
