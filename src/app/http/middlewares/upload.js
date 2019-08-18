import Upload from 'libraries/upload';
import trimStart from 'lodash/trimStart';

/**
 * Uploads files and binds urls
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export default function upload(req, res, next) {
  req._files = [];
  if (req.files) {
    const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
    const uploads = [];
    files.map((file) => uploads.push(Upload.file(trimStart(req.baseUrl, '/'), file)));
    Promise
        .all(uploads)
        .then(async (results) => {
          req._files = results;
          next();
        }).catch((err) => next);
  } else {
    next();
  }
}
