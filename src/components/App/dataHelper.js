import AppStore from '../../stores/AppStore';
import AppActions from '../../actions/AppActions';
import net from './net';

// const log = (e) => {
//   console.log(e);
// };

function state(){
  return AppStore.getAllState()
}

export default {
  //初始化会话信息
  initSessionList:function(){
    return new Promise((resolve, reject) => {
      net.connect({
        data: {
          t: 15,
          uId: state().profile.uId
        },
        success: (json) => {
          AppActions.sessionsInit(json.sesList);
          resolve();
        },
        error: (data) => {
          reject(data);
        }
      });
    });
  },
  //添加一条通知
  contactRequestNotice:function(json){
    //json
    /**
      * {
      *   t: 23,
      *   frm:'123'  // 代表A
      *   des:'验证信息'
      * }
      */
    net.connect({
      data:{
        t:29,
        uId: state().profile.uId
      },
      success:(data)=>{

        let userInfo = _.find(data.friends,(item)=>{
          return json.frm === item.id;
        });

        if(!userInfo) {
          return;
        }

        AppActions.unshiftNotice({
          t:23,
          h1:`${userInfo.name}请求加您为好友`,
          h2:`${userInfo.des}`,
          img: userInfo.img,
          id: userInfo.id,
          tp: userInfo.tp  // 1-已是好友关系，3-向自己申请了添加好友但自己还未同意
        });
      },
      error:(data)=>{
        reject(data);
      }
    });
  },
  // 初始化好友列表
  setFriends:function(){
    return new Promise((resolve, reject) => {
      net.connect({
        data:{
          t: 31,
          uId: state().profile.uId
        },
        success: (json) => {
          AppActions.setContacts(json.friends);
        },
        error: (data) => {
          reject(data);
        }
      });
    });
  },
  // 如果没有会话列表，从服务器拉数据，然后添加一条数据到 sessionList
  unshiftSession:function(sId){
    return new Promise((resolve, reject) => {
      //没有会话列表的话,拉取会话列表
      if(!AppStore.hasSession(sId)){
        net.connect({
          data: {
            t: 15,
            uId: state().profile.uId
          },
          success: (json) => {
            AppActions.unshiftSession(sId,json.sesList);
            resolve();
          }
        });
      }
      else{
        resolve();
      }
    });
  },
  //为当前会话添加，会话属性
  setAttr:function(sId){
    return this.unshiftSession(sId).then(()=>{
      return new Promise((resolve, reject) => {
        let hasAttr = AppStore.hasSessionAttr(sId);
        if (!hasAttr) {
          net.connect({
            data: {
              t: 17,
              uId: state().profile.uId,
              sId: sId
            },
            success: (data) => {
              AppActions.sessionAttr(data);
              resolve();
            },
            error:(data) =>{
              reject();
            }
          });
        }
        else{
          resolve();
        }
      });
    });
  }
}