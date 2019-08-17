import mongoose from 'mongoose';
import database from 'config/database';

const {uri, config} = database();
mongoose.set('useFindAndModify', false);
mongoose.connect(uri, config);

export default mongoose;
