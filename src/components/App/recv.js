import marine from '../../../config/marine';
import AppActions from '../../actions/AppActions';
import dataHelper from './dataHelper';
// import net from './net';

const log = (e) => {
  console.log(e);
};

export default (json) => {

  if (json.t) {
    switch (json.t) {

      // 接收绑定消息
      case 2:
        if(json.ret === -1){
          log('login fail!');
          location.href = marine.loginUrl + '?ret=' + encodeURIComponent(location.href);
        }
        return true;

      // 收消息
      case 7:
        dataHelper.setAttr(json.frm).then(()=>{
          AppActions.recieveMessage(json);  
        })
        return true;

      // 接收群属性改变的通知
      case 11:
        dataHelper.setAttr(json.sId).then(()=>{
          AppActions.recieveAlterSessionAttr(json);
        });
        return true;

      // 建立群会话通知
      case 19:
        dataHelper.setAttr(json.sId);
        return true;

      // 收到添加好友请求
      case 23:
        dataHelper.contactRequestNotice(json);
        return true;

      // 同意添加好友通知
      case 26:
        dataHelper.setFriends();
        dataHelper.setAttr(json.frm);
        return true;

      default:
        log('recv: %o', json);
        return false;
    }
  }
};
