import ajax from 'ajax';
import net from './net';

function getQtv() {
  return new Promise((resolve, reject) => {
    ajax({
      url: '/api/qtv',
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

function login() {
  return new Promise((resolve, reject) => {
    getQtv()
      .then((cookie) => {
        if(cookie.q === undefined || cookie.v === undefined || cookie.t === undefined){
          resolve({ret:-1});
          return;
        }

        net.connect({
          data: {
            t: 1,
            c: {
              iv: 'ws.0.1',
              qcookie: cookie.q,
              vcookie: cookie.v,
              tcookie: cookie.t
            }
          },
          success: (data) => {
            resolve(data);
          },
          error: (e) => {
            reject(e);
          }
        });
      });
  });
}

export default {
  getQtv, 
  login
};
