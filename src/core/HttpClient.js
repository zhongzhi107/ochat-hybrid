'use strict';

import ajax from 'ajax';

const HttpClient = {
  get: (url) => {
    return new Promise((resolve, reject) => {
      ajax({
        url: url,
        dataType: 'json',
        success: (data) => {
          resolve(data);
        },
        error: (e) => {
          reject(e);
        }
      });
    });
  }
};


export default HttpClient;
