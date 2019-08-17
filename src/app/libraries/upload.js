import cloudinary from 'cloudinary';
import uuid from 'uuid/v4';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Class to manage file uploads
 */
export default class Upload {
  /**
   * Uploads file from local storage to cloudinary
   * @param {String} file
   * @return {Promise}
   */
  static imageFromFile(file) {
    return new Promise((resolve, reject) => {
      return cloudinary.uploader.upload(file, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  /**
   * Uploads file from stream to cloudinary
   * @param {String} dir
   * @param {Stream} file
   * @param {String} type
   * @return {Promise}
   */
  static file(dir, file, type = 'image') {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line max-len
      const stream = cloudinary.v2.uploader.upload_stream({resource_type: type, public_id: path.join(dir, uuid())}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });

      stream.end(file.data);
    });
  }
}
