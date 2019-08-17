import cloudinary from 'cloudinary';

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
   * @param {Stream} file
   * @param {String} type
   * @return {Promise}
   */
  static file(file, type) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line max-len
      const stream = cloudinary.v2.uploader.upload_stream({resource_type: type}, (err, res) => {
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
