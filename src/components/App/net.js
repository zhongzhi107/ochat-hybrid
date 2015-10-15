import UTF8 from '../../utils/buffer';
import getImClient from '../../utils/im';
import ajax from 'ajax';
import marine from '../../../config/marine';
// import AppStore from '../../stores/AppStore';
import AppActions from '../../actions/AppActions';
import dataHelper from './dataHelper';
import UC from './login';
import clientRecv from './recv.js';


const httpMap = {
  3:'im_build_group',  //3
  9:'im_ses_update',    //9
  13:'im_msg_list',        //13
  15:'im_user_ses',        //15
  17:'im_ses_info',        //17
  21:'im_apply_friend',//21
  24:'im_agree_friend',//24
  27:'im_rec_friends',  //27
  29:'im_new_friends',  //29
  31:'im_my_friends',    //31
  'yacca':'get_yacca',
};

const appName = 'OChat';

const log = (e) => {
  console.log(e);
};

/**
 * 接口转换
 */
function net(json) {

  // websocket api 
  let wsApi = [1, 5, 20];
  
  //console.log(json.data.t);
  (wsApi.indexOf(json.data.t) > -1 ? wsClient : httpClient)(json);
  // wsClient(json);
}

/**
 * http
 */
let httpClient = (() => {

  return (opt) => {

    opt.data.t = httpMap[opt.data.t];
    opt.data.iv = 'ws.0.1';
    //opt.data.c.uuid = AppStore.getAllState().profile.uId;

    opt.data = {
      'json': JSON.stringify(opt.data)
    };

    ajax(
      _.assign({
        url: '/api/im',
        type: 'post',
        dataType: 'json',
        error: log
      }, opt)
    );

  };
  
})();

/**
 *  WebSocket
 */
let wsClient = (() => {

  let client = getImClient();

  UC.getQtv().then((cookie)=>{
    if(cookie.q === undefined || cookie.v === undefined || cookie.t === undefined){
      location.href = marine.loginUrl + '?ret=' + encodeURIComponent(location.href);
      return;
    }
    getSocketServer().then((socketServer) => {
      client.setHosts(['ws://' + socketServer]);
      client.setAppName(UTF8.encode(appName));
      client.recv = clientRecv;
      client.onConnect = clientConnect;
      client.connect();
    },log);
  });
  
  function getSocketServer(){
    return new Promise((resolve, reject) => {
      net({
        data:{
          t:'yacca'
        },
        success: (data) => {
          if(data.yList){
            data = data.yList[0];
            resolve(`${data.ip}:${data.wPort}`);
          }
          else{
            reject(`${JSON.stringify(data)},yacca接口没有返回地址`);
          }
        },
        error: reject
      });
    });
  }

  function clientConnect() {
    log('connected');
    UC.login().then(loginSuccess, log);
  }

  function loginSuccess(json) {
    if (json.ret === 0) {
      AppActions.profileUpdate({
        isLogin: true,
        name: json.name,
        uId: json.uId.toString(),
        img: json.img
      });
      dataHelper.initSessionList().then(()=>{
        dataHelper.setFriends();  
      });
    } else {
      log('login fail!');
      location.href = marine.loginUrl + '?ret=' + encodeURIComponent(location.href);
    }
  }

  return (json) => {
    json.json = json.data;
    json.okCallback = json.success;
    json.errCallback = json.error || log;

    delete json.data;
    delete json.success;
    delete json.error;

    client.request(json);
  };

})();

export default {
  /**
   * 网络请求接口
   * net.connect({
   *   data: {} | ''  //数据
   *   success: function(){} // 成功回调
   *   error: function(){}   // 错误处理  默认 function(e){ console.log(e)}
   * })
   */
  connect: net
};
