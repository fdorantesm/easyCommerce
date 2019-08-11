/* eslint-disable new-cap */
import mongoose from 'mongoose';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';
// eslint-disable-next-line no-unused-vars
import mongooseGeoJsonSchema from 'mongoose-geojson-schema';
// import haversine from 'haversine';

const fields = {
  from: {
    address: {
      line1: {
        type: String
      },
      line2: {
        type: String
      },
      line3: {
        type: String
      },
      references: {
        type: String
      },
      betweenStreets: {
        type: String
      },
      zip: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      }
    },
    location: {
      type: mongoose.Schema.Types.Point,
      coordinates: [mongoose.Schema.Types.Double],
      required: true
    },
    sender: {
      name: String,
      phone: String
    }
  },
  to: {
    address: {
      line1: {
        type: String
      },
      line2: {
        type: String
      },
      line3: {
        type: String
      },
      references: {
        type: String
      },
      betweenStreets: {
        type: String
      },
      zip: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      }
    },
    location: {
      type: mongoose.Schema.Types.Point,
      coordinates: [mongoose.Schema.Types.Double],
      required: true
    },
    receiver: {
      name: String,
      phone: String
    },
  },
  amount: {
    type: Number,
    required: true
  },
  carrier: {
    type: String
  },
  track: {
    type: String
  },
  type: {
    type: String,
    enum: ['ground', 'airplain', 'cheap', 'express', '2 day'],
  },
  secured: {
    type: Boolean,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  status: {
    type: String,
    default: 'created'
  }
};

const options = {
  discriminatorKey: '_type',
  timestamps: true
};

const Delivery = new mongoose.Schema(fields, options);

// Delivery.set('toJSON', {virtuals: true});
// Delivery.set('toObject', {virtuals: true});

Delivery.plugin(mongoosePaginate);
Delivery.plugin(mongooseBeautifulUniqueValidation);

// Delivery.virtual('distance').get(function() {
// const options = {format: '[lon,lat]'};
// eslint-disable-next-line max-len,no-invalid-this
// return haversine(this.from.location.coordinates, this.to.location.coordinates, options);
// });

export default mongoose.model('Delivery', Delivery);
