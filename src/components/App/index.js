'use strict';

import React, {Component} from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import AppStore from '../../stores/AppStore';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import AppConstants from '../../constants/AppConstants';
import AppActions from '../../actions/AppActions';
import _ from 'lodash';
// import ajax from 'ajax';
// import marine from '../../../config/marine';
import net from './net';
import dataHelper from './dataHelper';
import Panel from './Panel';
import Dialog from './Dialog';
import ContactsLayer from './ContactsLayer';

function getState() {
  return AppStore.getAllState();
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = getState();
    this.tabs = ['会话', '联系人'];
    this.originAttr = null;
    this.contactsLayerActive = false;
  }

  componentWillMount() {
    if (canUseDOM) {
      require('./App.less');
    }
  }

  componentDidMount() {
    AppStore.addChangeListener(this.onChange.bind(this));

    AppDispatcher.register((action) => {
      switch(action.actionType) {
        case AppConstants.RECIEVE_MESSAGE:
          if (action.data.frm.toString() !== getState().profile.uId) {
            this.playAudio();
          }
        break;
        default:
      }
    });
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onChange.bind(this));
  }

  render() {
    return (

      <div className="wrapper">
        <div className="main">
          <Panel data={this.state} tabs={this.tabs}
            request={(e) => this.request(e)}
            switchTab={(e) => this.switchTab(e)}
            switchSession={(e) => this.switchSession(e)}
            switchContact={(e) => this.switchContact(e)}
            shiftNotice={(e) => AppActions.shiftNotice(e)}
            setFriends={(e) => dataHelper.setFriends(e)}
            toggleSound={(e) => this.toggleMutedAudio(e)}
            showContactsLayer={(e) => this.showContactsLayer(e)}
            logout={(e) => this.logout()}/>
          <Dialog data={this.state}
            request={(e) => this.request(e)}
            switchSession={(e) => this.switchSession(e)}
            sendMessage={(e) => this.sendMessage(e)}
            getHistoryMessage={(e) => this.getHistoryMessage(e)}
            clearUnreadMessage={(e) => AppActions.clearUnreadMessage(e)}
            resendMessage={(e) => this.resendMessage(e)}
            showContactsLayer={(e) => this.showContactsLayer(e)} />
          <ContactsLayer data={this.state} originAttr={this.originAttr} active={this.contactsLayerActive}
            request={(e) => this.request(e)}
            hideContactsLayer={(e) => this.hideContactsLayer(e)}
            setAttr={(e) => dataHelper.setAttr(e)}
            unshiftSession={(e) => dataHelper.unshiftSession(e)}
            switchSession={(e) => this.switchSession(e)} />
        </div>
        <div className="audio hide">
          <audio ref="audio" src="" preload={true} ></audio>
        </div>
      </div>

    );
  }

  request(req) {
    let data = req.data;
    let callback = req.callback || null;
    let notice = req.notice || null;
    if(data.frm === 'self') {
      data.frm = getState().profile.uId;
    }
    net.connect({
      data: data,
      success: (res) => {
        console.log(data.t, res);
        notice && AppActions.unshiftNotice(notice);
        callback && callback(res);
      },
      error: (res) => {
        console.log(data.t, res);
      }
    });
  }

  switchTab(index) {
    AppActions.switchTab(parseInt(index));

    // 发送消息
    // this.sendMessage({
    //   t:5,
    //   'to':'1_tYQ9YGR0oAejJCmKKyMgNw%3D%3D',
    //   'ctnt':'test' + +new Date(),
    //   "tp":1,
    //   "iv":'ws.0.1',
    //   'st': +new Date()
    // });

    // sia 2_39

    // 修改群消息
    // net.connect({
    //   data:{
    //     t:9,
    //     sId:'2_39',
    //     uId:getState().profile.uId,
    //     alter:{
    //       name: '修改群名称'+ +new Date()
    //     }
    //   }
    // });

    // 创建群
    // net.connect({
    //   data:{
    //     t:3,
    //     'frm': getState().profile.uId,
    //     'toList':['1_1444547239','1_1444547604','1_1444547588','1_1444547231','1_1444483654']
    //   },
    //   success:(data)=>{
    //     console.log(data);
    //   },
    //   error:()=>{
    //     console.log(data);
    //   }
    // })

    // 添加好友
    // 1_1444547231  => 1_1444483654
    // net.connect({
    //   data:{
    //     t:21,
    //     'frm':getState().profile.uId,
    //     'to':'1_1444477122',
    //     'des':'我是A啊'
    //   },
    //   success:(msg) =>{
    //     console.log(msg);
    //   },
    //   error:(msg) => {
    //     console.log(msg);
    //   }
    // });

    // 获取好友请求通知
    // net.connect({
    //   data:{
    //     t:29,
    //     uId:'12'
    //   },
    //   success:(data)=>{
    //     console.log(data);
    //   }
    // });

    // 同意添加为好友
    // net.connect({
    //   data:{
    //     t:24,
    //     frm:getState().profile.uId,
    //     to:'1_1444547588'
    //   }
    // });

    // 产生通知
    // AppActions.unshiftNotice({
    //   t: 1,
    //   h1: 'Hello' + +new Date(),
    //   h2: ['world', '!'],
    //   btnCancel: '关闭',
    //   btnClose: true
    // });

    // AppActions.shiftNotice();
  }

  switchSession(sId) {
    this.switchTab(0); // 首先切换到会话列表
    if (sId === getState().currentSessionId) {
      return;
    }
    dataHelper.setAttr(sId)
      .then(() =>{
        AppActions.switchSession(sId);
        AppActions.clearUnreadMessage(sId);
        this.getHistoryMessage(sId);
      });
  }

  switchContact(contactId) {
    if (contactId === getState().currentContactId) {
      return;
    }
    AppActions.switchContact(contactId);
  }

  sendMessage(data) {
    if(!data.dId) {
      data.dId = _.random(10000);
    }
    let uId = getState().profile.uId;
    data = _.assign(data,{
      frm: uId,
      c:{
        uuid:uId
      }
    });
    net.connect({
      data: data,
      success: AppActions.sendMessageOK,
      error: (errorMessage) => {
        AppActions.sendMessageError({
          dId: data.dId,
          to: data.to,
          errorMessage: errorMessage
        });
      }
    });
    AppActions.clearUnreadMessage(data.to);

    if (data.hasOwnProperty('fail')) {
      AppActions.removeMessageFailProperty({
        dId: data.dId,
        sId: data.to
      });
    } else {
      AppActions.recieveMessage(data);
    }
  }

  //data.sId data.dId
  resendMessage(data) {
    let message;
    let state = getState();
    let index = _.findIndex(state.sessionList, (item) => {
      return data.sId === item.id;
    });

    if (index > -1) {
      message = _.find(state.sessionList[index].messageList, (item) => {
        return data.dId === item.dId;
      });
    }
    this.sendMessage(message);
  }

  getHistoryMessage(sId) {
    let endId;
    let allHistoryMessages = AppStore.getSessionHistoryMessage(sId);
    if (allHistoryMessages) {
      endId = parseInt(_.result(_.first(allHistoryMessages), 'mId'), 10) - 1;
      // 没有历史纪录了
      if (endId === 0) {
        return;
      }
    }
    net.connect({
      data:{
        t: 13,
        uId: getState().profile.uId,
        sId: sId,
        endId: endId
      },
      success: AppActions.historyMessageUpdate
    });
  }

  playAudio(mp3) {
    let src = mp3;
    if (!src) {
      src = '/med/ring.mp3';
    }
    let audio = this.refs.audio.getDOMNode();
    if( audio.paused || (audio.src.indexOf('ring.mp3') > -1) || (src.indexOf('ring.mp3') < 0)) {
      //当前并未播放音乐 || 正在播放中的是消息提示铃声 || 新来的音乐不是消息提示铃声
      //则打断后播放新音乐
      audio.setAttribute('src', src);
      audio.play();
    }
  }

  toggleMutedAudio() { //关闭/打开铃声
    this.refs.audio.getDOMNode().muted = !this.refs.audio.getDOMNode().muted;
  }

  showContactsLayer(attr) {
    this.originAttr = attr;
    this.contactsLayerActive = true;
    this.forceUpdate();
  }

  hideContactsLayer(e) { // 隐藏联系人列表浮层
    this.originAttr = null;
    this.contactsLayerActive = false;
    this.forceUpdate();
  }

  logout() {
    window.open('http://touch.qunar.com/h5/user/logout?retUrl=http://ochat.qunar.com', '_self');
  }

  onChange() {
    this.setState(getState());
  }

  receiveMessage(data) {
    AppActions.receiveMessage(data);
  }

}

export default App;
