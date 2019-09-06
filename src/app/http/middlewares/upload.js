/* eslint-disable indent */
import Upload from 'libraries/upload';
import trimStart from 'lodash/trimStart';

/**
 * Uploads files and binds urls
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export default function upload(req, res, next) {
  console.log('uploads');
  req._files = [];
  if (req.files) {
    // eslint-disable-next-line max-len
    const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
    const uploads = [];
    // eslint-disable-next-line max-len
    files.map((file) => uploads.push(Upload.file(trimStart(req.baseUrl, '/'), file)));
    console.log({uploads});
    Promise.all(uploads).then(async (results) => {
      console.log({results});
      req._files = results;
      next();
    }).catch((err) => {
      console.log(err);
      return res.boom.serverUnavailable(res.__('There was a problem while trying to resolve your request. Try again in a few minutes.'));
    });
  } else {
    next();
  }
}
