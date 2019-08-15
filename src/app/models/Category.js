import mongoose from 'mongoose';
import mongooseSoftDelete from 'mongoose-softdelete';
import mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import mongoosePaginate from 'mongoose-paginate-v2';

const fields = {
  name: {
    type: String,
    unique: true,
    sparse: true,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  order: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false
  }
};

const options = {
  timestamps: true
};

const Category = new mongoose.Schema(fields, options);

Category.plugin(mongooseSoftDelete);
Category.plugin(mongoosePaginate);
Category.plugin(mongooseBeautifulUniqueValidation);

export default mongoose.model('Category', Category);
