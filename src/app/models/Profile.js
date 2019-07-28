import mongoose from 'mongoose';

const fields = {
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  location: {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    }
  },
  phone: {
    type: String
  },
  dob: {
    type: Date
  },
  conekta: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }],
  addresses: [

  ],
  social: {
    type: Object
  },
  gender: {
    type: String
  }
};

const options = {
  discriminatorKey: '_type',
  timestamps: true
};

const Profile = new mongoose.Schema(fields, options);

export default mongoose.model('Profile', Profile);
