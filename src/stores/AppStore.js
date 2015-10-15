'use strict';

import {EventEmitter} from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import _ from 'lodash';

var CHANGE_EVENT = 'change';

var state = {
  currentTab: 0,
  currentSessionId: null,
  currentContactId: null,
  profile: {
    isLogin: false,
    name: '',
    img: '',
    uid: ''
  },
  sessionList: [],
  /**
   * {
   *   t:23,
   *   h1:'',
   *   h2:''
   *   autoDisappear: 0
   * }
   */
  notice:[]
};

window.getState = function() {
  return state;
};

function setProfile(profile) {
  state.profile = profile;
}

function setSessionList(sessionList) {
  state.sessionList = _.filter(sessionList, (item) => {
    // 排除和自己聊天的会话
    // 排除昵称为空(不存在用户)的会话
    return item.id !== state.profile.uId && (item.name + item.img !== '') ;
  });
}

/**
 * 添加一个会话列表
 * @param  {String} sId
 * @param  {Array} data 新的会话列表
 */
function unshiftSession(sId,data){
  let list = _.find(data,(item)=>{
    return sId === item.id
  });

  list && state.sessionList.unshift(list);
}

function setHistoryMessage(data) {
  let messages = (data.mList || []).filter((item) => {
    return item.sf === 1;
  });

  let index = _.findIndex(state.sessionList, (item) => {
    return data.sId === item.id;
  });

  if (index > -1) {
    state.sessionList[index].messageList =
      messages.concat(state.sessionList[index].messageList || []);
  }
}

function setMessage(data) {
  let index = _.findIndex(state.sessionList, (item) => {
    return [data.frm.toString(), data.to.toString()].indexOf(item.id) > -1;
  });
  if (index > -1) {
    state.sessionList[index].messageList =
      (state.sessionList[index].messageList || []).concat([data]);
    // 以下是自己收到别人发来的消息
    if (data.frm.toString() !== state.profile.uId) {
      state.sessionList[index].nr = data.nr;
    }
  }
}

function sendMessageOK(data) {
  let index = _.findIndex(state.sessionList, (item) => {
    return [data.frm, data.to].indexOf(item.id) > -1;
  });
  if (index > -1 && state.sessionList[index].messageList) {
    let originMessage = _.find(state.sessionList[index].messageList, (item) => {
      return item.dId === data.dId;
    });
    originMessage = _.assign(originMessage, data);
  }
}

function sendMessageError(data) {
  let index = _.findIndex(state.sessionList, (item) => {
    return data.to === item.id;
  });

  if (index > -1) {
    _.find(state.sessionList[index].messageList, (item) => {
      return data.dId === item.dId;
    }).fail = true;
  }
}

function removeMessageFailProperty(data) {
  let index = _.findIndex(state.sessionList, (item) => {
    return data.to === item.id;
  });

  if (index > -1) {
    delete _.find(state.sessionList[index].messageList, (item) => {
      return data.dId === item.dId;
    }).fail;
  }
}

function setCurrentSessionId(sId) {
  //先看会话列表里面有没有
  //如果没有查找好友
  //如果有好友则添加一个会话
  //如果没有则不变
  let index = _.findIndex(state.sessionList, (elem) => {
    return sId === elem.id;
  });

  if(index > -1){
    state.currentSessionId = sId;  
  }
  else{
    let item = _.find(state.profile.contacts,(elem) => {
      return elem.id === sId;
    });

    item && state.sessionList.unshift(item);
  }

}

function setCurrentTab(index){
  state.currentTab = index;
}

function setCurrentContactId(contactId){
  state.currentContactId = contactId; 
}

function clearUnreadMessage(sId) {
  let index = _.findIndex(state.sessionList, (item) => {
    return sId === item.id;
  });

  if (index > -1) {
    state.sessionList[index].nr = 0;
  }
}

function getSessionAttr(data){
  
  let index = _.findIndex(state.sessionList, (item) => {
    return data.sId === item.id;
  });

  if (index > -1) {
    state.sessionList[index].attr = data.info || {};
  }
}

function setContacts(data = []){
  state.profile.contacts = data.sort((a,b) =>{
    return a.name.toString().localeCompare(b.name.toString());
  });
}

function recieveAlterSessionAttr(data){
  let index = _.findIndex(state.sessionList, (item) => {
    return data.sId === item.id;
  });

  if(index > -1){

    let session = state.sessionList[index];
    
    //修改者名称
    let alterName = '';

    if(session.attr){
      alterName = _.find(session.attr.members,(item)=>{
        return item.id === data.uId;
      });

      if(alterName){
        alterName = alterName.name;
      }
    }

    //修改了群名称
    // if(data.alter.name){
    //   session.messageList = (session.messageList || []).concat([{
    //     ctnt:`${alterName}变更群名称为${data.alter.name}`,
    //     st: +new Date(),
    //     tp: 0
    //   }]);
    //   session.name = data.alter.name;
    //   // session.nr++;
    // }
    //移除了用户（暂时还没有移除功能）
    // if(data.alter.rmv){
    // }
    //添加了用户
    if(data.alter.addDetail){
      let newUser = [];
      data.alter.addDetail.forEach((item)=>{
        newUser.push(item.name);
      });
      session.messageList = (session.messageList || []).concat([{
        ctnt:`${alterName}邀请${newUser.join(',')}加入群聊`,
        st: +new Date(),
        tp: 0
      }]);
      // session.nr++;
    }
  }
}

function shiftNotice(){
  state.notice.shift();
}

function unshiftNotice(data){
  state.notice.unshift(data);
}

var AppStore = assign({}, EventEmitter.prototype, {

  getAllState: () => {
    return state;
  },

  getSessionHistoryMessage: (sId) => {
    return _.result(_.find(state.sessionList, (item) => {
      return item.id === sId;
    }), 'messageList');
  },

  // 是否已有会话属性
  hasSessionAttr: (sId) => {
    return _.result(_.find(state.sessionList, (item) => {
      return item.id === sId;
    }), 'attr');
  },

  hasSession: (sId) =>{
    return _.find(state.sessionList, (item) => {
      return item.id === sId;
    });
  },

  findContacts: (uId) => {
    return _.find(state.profile.contacts,(item) => {
      return item.id === uId;
    });
  },

  emitChange: () => {
    AppStore.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: (callback) => {
    AppStore.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: (callback) => {
    AppStore.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case AppConstants.PROFILE_UPDATE:
      setProfile(action.profile);
      AppStore.emitChange();
      break;

    case AppConstants.SESSION_INIT:
      setSessionList(action.sessionList);
      AppStore.emitChange();
      break;

    case AppConstants.UNSHIFT_SESSION:
      unshiftSession(action.sId,action.data);
      AppStore.emitChange();
      break;

    case AppConstants.MESSAGE_HISTORY:
      setHistoryMessage(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.RECIEVE_MESSAGE:
      setMessage(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.SEND_MESSAGE_OK:
      sendMessageOK(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.SEND_MESSAGE_ERROR:
      sendMessageError(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.REMOVE_MESSAGE_FAIL_PROPERTY:
      removeMessageFailProperty(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.SWITCH_SESSION:
      setCurrentSessionId(action.sId);
      AppStore.emitChange();
      break;

    case AppConstants.SWITCH_TAB:
      setCurrentTab(action.index);
      AppStore.emitChange();
      break;

    case AppConstants.SWITCH_CONTACT:
      setCurrentContactId(action.contactId);
      AppStore.emitChange();
      break;

    case AppConstants.CLEAR_UNREAD_MESSAGE:
      clearUnreadMessage(action.sId);
      AppStore.emitChange();
      break;

    case AppConstants.SESSION_ATTR:
      getSessionAttr(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.CONTACTS:
      setContacts(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.RECIEVE_ALTER_SESSION_ATTR:
      recieveAlterSessionAttr(action.data);
      AppStore.emitChange();
      break;

    case AppConstants.SHIFT_NOTICE:
      shiftNotice();
      AppStore.emitChange();
      break;

    case AppConstants.UNSHIFT_NOTICE:
      unshiftNotice(action.data);
      AppStore.emitChange();
      break;

    default:
      // no op
  }

});

export default AppStore;
