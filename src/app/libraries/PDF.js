import pug from 'pug';
import htmlPdf from 'html-pdf';
import {view} from 'helpers/common';
import fs from 'fs';
import merge from 'lodash/merge';

/**
 * PDF Class library
 */
class PDF {
  /**
   * PDF Constructor
   * @param {String} file
   * @param {Object} data
   * @param {Object} options
   */
  constructor(file, data = {}, options = {}) {
    this.template = null;
    this.buffer = null;
    this.file = file;
    this.data = data;
    this.options = {};
    this.options.quality = 50;
    this.options.timeout = 30000;
    this.options = merge(this.options, options);
    this.layout = 'pdf';
  }
  /**
   * Bind values to template
   * @param {String} file
   * @param {Object} data
   * @return {Promise<String>} Rendered pug template
   */
  _renderTemplate(file, data = {}) {
    const partial = pug.renderFile(view(file), data);
    // data.partial = partial;
    // const template = pug.renderFile(view(this.layout), data);
    return Promise.resolve(partial);
  }
  /**
   * Get PDF buffer
   * @return {Promise<Buffer>} PDF Buffered
   */
  async render() {
    return new Promise(async (resolve, reject) => {
      const html = await this._renderTemplate(this.file, this.data);
      htmlPdf.create(html, this.options, (err, pdf) => {
        if (err) {
          reject(err);
        } else if (!pdf) {
          reject(new Error('PDFException'));
        } else {
          const file = fs.readFileSync(pdf.filename);
          resolve(file);
        }
      });
    });
  }
}

export default PDF;
