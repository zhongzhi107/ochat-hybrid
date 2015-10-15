import React from 'react';
// import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import ChatMsgBox from './ChatMsgBox';
import ChatInputBox from './ChatInputBox';
// import cn from 'classnames';

class ChatBox extends React.Component {

	constructor() {
		super();
	}

	componentWillMount() {
		// if (canUseDOM) {
		// 	require('./ChatBox.less');
		// }
	}

	render () {
		/*
		return (
			<div id={`chat-${this.props.data.session.id}`}
					className={cn({
						'chatBox': this.props.active,
						'hide': !this.props.active
					})}>
		*/
		return (
			<div id={`chat-${this.props.data.session.id}`} className={this.props.active ? 'chatBox' : 'hide'}>
				<ChatMsgBox data={this.props.data}
					getHistoryMessage={(e) => this.props.getHistoryMessage(e)}
					clearUnreadMessage={(e) => this.props.clearUnreadMessage(e)}
					showProfileLayer={(e) => this.props.showProfileLayer(e)}
					resendMessage={(e) => this.props.resendMessage(e)} />
				<ChatInputBox sendMessage={(e) => this.sendMessage(e)} />
			</div>
		);

	}

	sendMessage(data) {
		data.to = this.props.data.session.id;
		this.props.sendMessage(data);
	}

}

export default ChatBox;
