import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../../../utils/dom.js';
import ImageView from './ImageView';

class ChatMsg extends React.Component {

	constructor() {
		super();
		this.TIME_SEPERATOR_BY_MINUTES = 2;
		this.imageViewSrc = '';
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./ChatMsg.less');
		}
	}

	componentDidMount() {

	}

	render () {
		let {msg, target} = this.props.data;
		let content = '';
		let sysmsg = false;
		if(msg.dId === 1) {
			if(!target.isSelf) {
					//添加好友成功后，系统自动生成的两条消息，把对方那条更改为系统消息
					msg.tp = 0;
			} else { // 自己这条不显示
				return null;
			}
		}
		switch(msg.tp) {
			case 0: case 3: //该会话系统消息
				content = msg.ctnt;
				sysmsg = true;
				break;
			case 1: //文本消息
				content = msg.ctnt.split('\n').map(function(elem, index) {
					return (
						<p key={`msg-${msg.dId}-ctnt-${index}`}>{elem}</p>
					);
				});
				break;
			case 2: //图片消息
				content = <p><img src={msg.ctnt} onClick={(e) => this.viewImage(e)} /></p>;
				break;
			default:
			 content = <p>msg.ctnt</p>;
		}
		let imageViewNode = this.imageViewSrc !== '' ? <ImageView src={this.imageViewSrc} hideImageView={(e) => this.hideImageView(e)} /> : '';
		return (
			<div id={`dId-${msg.dId}`} className={target.isSelf ? 'chatMsg chatMsgRight' : 'chatMsg chatMsgLeft'}>
				<p className={this.ifShowTime(msg.st) ? 'time' : 'hide'}><span>{this.getShowTime(msg.st)}</span></p>
				<div className={sysmsg ? 'sysmsg' : 'hide'}><span>{content}</span></div>
				<img className={!sysmsg ? 'usericon' : 'hide'} src={target.avatar} title={target.name} data-uid={msg.frm}
						onClick={(e) => this.showProfileInfo(e)} />
				<div className={!sysmsg ? 'contentBox' : 'hide'}>
					<h4 className="nickname">{target.name}</h4>
					<div className="content">
						<div title="点击重新发送" className={msg.fail ? 'status' : 'hide'} onClick={(e) => this.resendMessage(e)}></div>
						{content}
					</div>
				</div>
				{imageViewNode}
			</div>
		);
	}

	resendMessage (e) {
		this.props.resendMessage(this.props.data.msg.dId);
	}

	ifShowTime (curTime) {
		let lastTime = this.props.lastTime*1;
		curTime *= 1;
		if (curTime - lastTime > this.TIME_SEPERATOR_BY_MINUTES*60*1000) {
			return true;
		}
		return false;
	}

	getShowTime (msgTime) {
		let today = new Date();
		let time = new Date(msgTime);
		let year = time.getFullYear();
		let month = time.getMonth();
		let date = time.getDate();
		if(year === today.getFullYear() && month === today.getMonth()) {
			switch(today.getDate() - date) {
				case 0:
					return time.toLocaleTimeString();
				case 1:
					return `昨天 ${time.toLocaleTimeString()}`;
				case 2:
					return `前天 ${time.toLocaleTimeString()}`;
				default:
					//return time.toLocaleString().replace(/\//, '年').replace(/\//, '月').replace(/\s/, '日 ');
					return `${year}年${month}月${date}日 ${time.toLocaleTimeString()}`;
			}
		}
		return `${year}年${month}月${date}日 ${time.toLocaleTimeString()}`;
	}

	showProfileInfo(e) {
		let target = e.target;
		let uId = target.getAttribute('data-uid');
		e = e.nativeEvent;
		let PROFILE_SIZE = 220;
		let parent = $.closest(e.target, '.dialog');
		let mouseLeft = e.clientX;
		let mouseTop = e.clientY;
		let parentLeft = parent.offsetLeft;
		let parentTop = parent.offsetTop;
		let parentWidth = parent.offsetWidth;
		let parentHeight = parent.offsetHeight;
		let left = mouseLeft + PROFILE_SIZE < parentLeft + parentWidth ? (mouseLeft - parentLeft) : (mouseLeft - parentLeft - PROFILE_SIZE);
		let top = mouseTop + PROFILE_SIZE < parentTop + parentHeight ? (mouseTop - parentTop) : (mouseTop - parentTop - PROFILE_SIZE);
		this.props.showProfileLayer({
			uId: uId,
			position: {
				left: left,
				top: top
			}
		});
	}

	viewImage(e) {
		this.imageViewSrc = e.target.src;
		this.forceUpdate();
	}

	hideImageView(e) {
		this.imageViewSrc = '';
		this.forceUpdate();
	}

}

export default ChatMsg;
