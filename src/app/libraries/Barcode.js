import request from 'request-promise';
import querystring from 'querystring';
import pickBy from 'lodash/pickBy';
import merge from 'lodash/merge';

/**
 * Bar code generator
 */
class Barcode {
  /**
   * BarCode constructor class
   * @param {Array} params
   */
  constructor(params = {}) {
    this._config = {};
    this._config.api = 'https://bwipjs-api.metafloor.com';
    this._config.bcid = 'code128';
    this._config.image = null;
    this._config.scale = 1;
    this._config.scaleX = 4;
    this._config.scaleY = 1;
    this._config.text = null;
    this._config.width = 20;
    this._config.height = 20;

    this._config = merge(this._config, params);

    const queryString = pickBy({
      'bcid': this._config.bcid,
      'scale': this._config.scale,
      'scaleX': this._config.scaleX,
      'scaleY': this._config.scaleY,
      'text': this._config.text,
      'alttext': this._config.text,
    });
    const query = querystring.stringify(queryString);
    this._config.image = `${this._config.api}/?${query}`;
  }

  /**
   * Get image url
   */
  get image() {
    return this._config.image;
  }

  /**
   * Get image object from url
   */
  async getImageObject() {
    return request.get(this._config.image, {encoding: 'binary'});
  }
}

export default Barcode;
