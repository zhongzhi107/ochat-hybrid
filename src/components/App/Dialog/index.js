import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import _ from 'lodash';
import AppStore from '../../../stores/AppStore.js';
import NoChat from './NoChat';
import ChatBox from './ChatBox';
import ProfileLayer from './ProfileLayer';
import MembersLayer from './MembersLayer';

class Dialog extends React.Component {

	constructor() {
		super();
		this.profileData = {
			active: false,
			profileInfo: {
				id: '',
				name: '',
				img: '',
				contact: false
			},
			position: {
				left: 0,
				top: 0
			}
		};
		this.membersData = {
			active: false,
			sessionId: null,
			sessionMode: null,
			sessionAttr: null
		}
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./Dialog.less');
		}
	}

	render () {
		let {profile, currentTab, currentSessionId, currentContactId, sessionList} = this.props.data;
		let title = !!currentSessionId && '聊天' || '';

		let chatBoxNodes = sessionList.map((elem, index) => {
			title = currentSessionId === elem.id ? elem.name : title;
			return (
				<ChatBox key={`chatbox-${index}`}
					data={{session:elem, profile, currentSessionId}}
					active={currentSessionId === elem.id ? true : false}
					sendMessage={(e) => this.props.sendMessage(e)}
					getHistoryMessage={(e) => this.props.getHistoryMessage(e)}
					clearUnreadMessage={(e) => this.props.clearUnreadMessage(e)}
					showProfileLayer={(e) => this.showProfileLayer(e)}
					resendMessage={(e) => this.props.resendMessage(e)}/>
			);
		});

		let currentSession = _.find(sessionList, function(chr) {return chr.id===currentSessionId});
		if(!!currentSession) {
			this.membersData.sessionId = currentSession.id;
			this.membersData.sessionMode = currentSession.mode;
			this.membersData.sessionAttr = currentSession.attr;
		}
		// 标题上展开成员列表的按钮
		let membersNode = currentTab === 0 && !!currentSessionId ? <div className={this.membersData.active ? 'chatMembersBtn spread' : 'chatMembersBtn'} onClick={(e) => this.toggleMembersLayer(e)}></div> : null;

		let contactList = profile.contacts;
		let chatContactNode = contactList && contactList.map((elem, index) => {
			return currentContactId === elem.id ?
				(<div key={`contact-${elem.id}`} className="chatContactInfo">
					<div className="avatar">
						<img src={elem.img} />
						<h1>{elem.name}</h1>
					</div>
					<div className="action">
						<a className="btn" data-uid={elem.id} onClick={(e) => this.sendMessageToContact(e)}>发消息</a>
					</div>
				</div>) :
				null;
		}) || null;


		let activeNoChat = null;
		let noChatTips = '';
		switch(currentTab) {
			case 0:
				activeNoChat = !currentSessionId;
				noChatTips = '未打开会话';
				break;
			case 1:
				title = '详细信息';
				activeNoChat = !currentContactId;
				noChatTips = '未选择联系人';
				break;
		}

		return (
			<div className="dialog">
				<div className="chatTitleBox">
					<div className="chatTitle">
						<span>{title}</span>
						{membersNode}
					</div>
				</div>
				<div className="chatContentBox">
					<NoChat active={activeNoChat} tips={noChatTips} />
					<div className={currentTab === 0 ? ' ' : 'hide'}>{chatBoxNodes}</div>
					<div className={currentTab === 1 ? ' ' : 'hide'}>{chatContactNode}</div>
				</div>
				<MembersLayer
					showProfileLayer={(e) => this.showProfileLayer(e)}
					hideMembersLayer={(e) => this.hideMembersLayer(e)}
					showContactsLayer={(e) => this.props.showContactsLayer(e)}
					{...this.membersData} />
				<ProfileLayer
					request={(e) => this.props.request(e)}
					switchSession={(e) => this.props.switchSession(e)}
					hideProfileLayer={(e) => this.hideProfileLayer(e)}
					{...this.profileData} />
			</div>
		);
	}

	toggleMembersLayer(e) {
		this.membersData.active = !this.membersData.active;
		this.forceUpdate();
	}

	hideMembersLayer(e) {
		this.membersData.active = false;
		this.forceUpdate();
	}

	showProfileLayer(data = {uId: this.profileData.profileInfo.id, position: this.profileData.position}) {
		this.profileData.active = true;
		let memberIndex = _.findIndex(this.membersData.sessionAttr.members, function(chr) { return chr.id === data.uId;});
		if(memberIndex < 0) {
			return;
		}
		this.profileData.profileInfo = this.membersData.sessionAttr.members[memberIndex];
		this.profileData.profileInfo.contact = !!AppStore.findContacts(data.uId);
		this.profileData.profileInfo.self = data.uId === this.props.data.profile.uId;
		this.profileData.position = data.position;
		this.forceUpdate();
	}

	hideProfileLayer() {
		this.profileData.active = false;
		this.forceUpdate();
	}

	sendMessageToContact(e) {
		let sId = e.target.getAttribute('data-uid');
		this.props.switchSession(sId);
	}

}

export default Dialog;
