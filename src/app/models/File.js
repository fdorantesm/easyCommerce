import mongoose from 'mongoose';

const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  format: {
    type: String
  },
  etag: {
    type: String
  },
  signature: {
    type: String
  },
  type: {
    type: String,
    required: true,
    sparse: true,
    enum: ['file', 'image', 'video', 'audio', 'document', 'bill', 'receipt'],
    default: 'file'
  },
  context: {
    type: String,
    default: 'gallery'
  },
  path: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
};

const options = {
  timestamps: true
};

const File = new mongoose.Schema(fields, options);

export default mongoose.model('File', File);
