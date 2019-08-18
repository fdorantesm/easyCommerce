/* eslint-disable new-cap */

import mongoose from 'mongoose';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseTypeEmail from 'mongoose-type-email'; // eslint-disable-line
import mongooseSoftDelete from 'mongoose-softdelete';

const fields = {
  nickname: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 24,
    unique: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: 'EmailAlreadyTakenException'
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: mongoose.Types.ObjectId('5bd4845873912e106d5481e7'),
    unique: true,
    spars: true
  }],
  status: {
    type: Number,
    default: 0
  },
  token: {
    type: String,
    select: false
  },
  lastLogin: {
    type: Date
  }
};

const options = {
  discriminatorKey: '_type',
  timestamps: true
};

const User = new mongoose.Schema(fields, options);

User.post('remove', (user) => {
  const Profile = mongoose.model('Profile');
  Profile.findByIdAndRemove(user.profile, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      console.log(row);
    }
  });
});

User.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.token;
    return ret;
  }
});

User.plugin(mongoosePaginate);
User.plugin(mongooseBeautifulUniqueValidation);
User.plugin(mongooseSoftDelete);

export default mongoose.model('User', User);
