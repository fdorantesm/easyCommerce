import mongoose from 'mongoose';
import database from 'config/database';

const {uri, config} = database();
mongoose.connect(uri, config);

export default mongoose;
