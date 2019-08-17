import mongoose from 'mongoose';

const fields = {
  p_type: String,
  v0: String,
  v1: String,
  v2: String,
  v3: String,
  v4: String,
  v5: String,
};

const options = {
  collection: 'casbin_rule'
};

const Rule = new mongoose.Schema(fields, options);

export default mongoose.model('Rule', Rule);
