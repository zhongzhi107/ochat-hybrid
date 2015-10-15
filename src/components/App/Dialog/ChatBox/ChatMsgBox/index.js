import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import _ from 'lodash';
import ChatMsg from './ChatMsg';
import $ from '../../../../../utils/dom.js';


class ChatMsgBox extends React.Component {

	constructor() {
		super();
		this.lastScrollTop = 0;
		this.lastMessageId = null;
		this.gettingHistory = false;
		this.nrForbid = false;
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./ChatMsgBox.less');
		}
	}

	componentDidMount() {
		this.scrollToBottom();
		let msgList = this.props.data.session.messageList;
		this.lastMessageId = msgList && msgList[msgList.length-1].dId || null;
	}

	componentDidUpdate() {
		let currentSessionId = this.props.data.currentSessionId;
		let sessionId = this.props.data.session.id;
		if (sessionId !== currentSessionId) { // 非当前激活session不执行操作
			return;
		}
		let msgList = this.props.data.session.messageList;
		let lastMsgId = msgList && msgList[msgList.length-1].dId || null;
		let lastMsgFrmId = msgList && msgList[msgList.length-1].frm || null; //最后一条消息的发送人ID
		let selfId = this.props.data.profile.uId; //当前登录用户的ID
		let chatMsgBox = this.refs.chatMsgBox.getDOMNode();
		let chatMsgBoxHeight = chatMsgBox.offsetHeight; // scrollTop = scrollHeight - div.offsetHeight
		if (chatMsgBox.scrollTop === this.lastScrollTop) { // 滚动条在更新前处于最底部，则更新后继续滚动到最底部
			this.scrollToBottom();
		} else if (selfId === lastMsgFrmId && lastMsgId !== this.lastMessageId) {
			// 自己新发送了消息，则直接滚动到最底部
			this.scrollToBottom();
			this.lastMessageId = lastMsgId;
		} else { // 滚动条更新前不处于最底部，则更新后保持原来位置，同时记录新的总滚动高度
			if (chatMsgBox.scrollHeight > 0) {
				let newScrollTop = chatMsgBox.scrollHeight - chatMsgBoxHeight;
				chatMsgBox.scrollTop = newScrollTop - (this.lastScrollTop - chatMsgBox.scrollTop)
				this.lastScrollTop = newScrollTop;
			}
		}
	}

	render () {
		let {attr, nr, messageList} = this.props.data.session;
		let profile = this.props.data.profile;
		let lastTime = 0;
		let msgNodes = messageList && messageList.map((elem, index) => {
			let time = lastTime;
			lastTime = elem.st;
			let target = {
				isSelf: false,
				name: '',
				avatar: ''
			};
			if (elem.tp !== 0 && elem.tp !== 3 ) {
				let idx = _.findIndex(attr.members, function(chr) {return chr.id === elem.frm.toString()});
				let img = attr.members[idx].img; //找到id对应的member的img
				let name = attr.members[idx].name; //找到id对应的member的name
				target = {
					isSelf : profile.uId === elem.frm.toString(),
					name : name,
					avatar : img
				};
			}
			return (
				<ChatMsg key={`chatmsg-${index}`} lastTime={time}
					data={{msg:elem, target}}
					showProfileLayer={(e) => this.props.showProfileLayer(e)} 
					resendMessage={(e) => this.resendMessage(e)} />
			);
		}) || '';

		return (
			<div className="chatMsgBoxWrapper">
				<div className="chatMsgBox" onWheel={(e) => this.handleWheel(e)} ref="chatMsgBox" >
					<div className="chatMsgList">
						{msgNodes}
					</div>
				</div>
				<div className={(() => {
					let cn = !this.nrForbid && nr > 0 ? 'newMsgTips' : 'hide';
					this.nrForbid = false;
					return cn;
				})()}
					onClick={(e) => this.clearUnreadMessage(e)}>
					{nr < 100 ? nr : '99+'}条新消息！
				</div>
			</div>
		);
	}

	resendMessage(dId) {
		let data = {
			sId: this.props.data.session.id,
			dId: dId
		}
		this.props.resendMessage(data);
	}

	clearUnreadMessage(e) {
		this.scrollToBottom();
		this.props.clearUnreadMessage(this.props.data.session.id);
	}

	handleWheel(e) {
		e = e.nativeEvent;
		let target = $.closest(e.target, '.chatMsgBox');
		if (target.scrollTop === 0) {
			if(!this.gettingHistory) { // 是否正在获取历史信息
				this.gettingHistory = true;
				setTimeout(() => {
					this.props.getHistoryMessage(this.props.data.session.id);
					this.gettingHistory = false;
				}, 1000);
			}
		}
		if (this.isBottom()) {
			this.clearUnreadMessage();
		}
	}

	isBottom() {
		let chatMsgBox = this.refs.chatMsgBox.getDOMNode();
		let chatMsgBoxHeight = chatMsgBox.offsetHeight;
		return chatMsgBox.scrollTop > chatMsgBox.scrollHeight - chatMsgBoxHeight - 10;
	}

	scrollToBottom() { // 滚动到最底部并记录滚动高度
		let chatMsgBox = this.refs.chatMsgBox.getDOMNode();
		let chatMsgBoxHeight = chatMsgBox.offsetHeight;
		chatMsgBox.scrollTop = chatMsgBox.scrollHeight - chatMsgBoxHeight;
		this.lastScrollTop = chatMsgBox.scrollTop;
		this.nrForbid = true;
	}

}

export default ChatMsgBox;
