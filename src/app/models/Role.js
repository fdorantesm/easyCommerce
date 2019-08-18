import mongoose from 'mongoose';
import mongooseSoftDelete from 'mongoose-softdelete';
// eslint-disable-next-line max-len
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';

const fields = {
  name: {
    type: String,
    unique: 'RoleAlreadyExistsException',
    sparse: true,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
};

const options = {
  timestamps: true
};

const Role = new mongoose.Schema(fields, options);

Role.plugin(mongooseSoftDelete);
Role.plugin(mongoosePaginate);
Role.plugin(mongooseBeautifulUniqueValidation);

export default mongoose.model('Role', Role);
