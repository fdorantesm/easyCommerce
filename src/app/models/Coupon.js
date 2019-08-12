import mongoose from 'mongoose';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseSoftDelete from 'mongoose-softdelete';

const fields = {
  code: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  type: {
    type: String,
    enum: ['amount', 'percentage'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  limits: {
    user: {
      type: Number,
      default: 1
    },
    uses: {
      type: Number,
      default: 0
    },
    expiration: {
      type: Number
    },
    minimumAmount: {
      type: Number
    },
    maximumAmount: {
      type: Number
    }
  },
  public: {
    type: Boolean,
    default: true
  },
  enabled: {
    type: Boolean
  }
};

const options = {
  timestamps: true
};

const Coupon = new mongoose.Schema(fields, options);

Coupon.plugin(mongoosePaginate);
Coupon.plugin(mongooseBeautifulUniqueValidation);
Coupon.plugin(mongooseSoftDelete);

export default mongoose.model('Coupon', Coupon);
