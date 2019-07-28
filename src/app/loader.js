/* eslint-disable indent */
import consign from 'consign';

const system = {};
const APP_PATH = process.env.APP_PATH;

consign({cwd: APP_PATH})
  .include('models')
  .include('config')
  .include('helpers')
  .include('libraries')
  .include('core')
  .include('http')
  .into(system);

export default system;
