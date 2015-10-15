import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../../../utils/dom.js';


class MsgPanel extends React.Component {
	
	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./MsgPanel.less');
		}
	}

	render () {
		let {currentSessionId, sessionList} = this.props.data;
		let msgNodes = sessionList.map((elem, index) => {
			let mTime = '';
			let mCtnt = '';
			let mLength = elem.messageList && elem.messageList.length || 0;
			if(mLength > 0) {
				mTime = this.getTime(parseInt(elem.messageList[mLength-1].st));
				mCtnt = elem.messageList[mLength-1].tp==2 ? '[图片]' : elem.messageList[mLength-1].ctnt; //图片消息则显示“[图片]”
			}
			return (
				<div id={`ses-${elem.id}`} key={`ses-${index}`} className={currentSessionId === elem.id ? 'msg active' : 'msg'} 
					onClick={(e) => this.switchSession(e)}>
					<div className="ext">
						<span>{mTime}</span>
					</div>
					<div className={elem.nr > 0 ? 'newMsg' : 'hide'}></div>
					<img src={elem.img} alt="" />
					<h4>{elem.name}</h4>
					<p>{mCtnt}</p>
				</div>
			);
		});
		return (
			<div className={this.props.active? 'msgPanel' : 'msgPanel hide'}>
				{msgNodes}
			</div>
		);
	}

	switchSession(e) {
		let target = $.closest(e.target, '.msg');
		let sesId = target.getAttribute('id');
		sesId = sesId.split('-')[1];
		this.props.switchSession(sesId);
	}

	getTime(time) {
		let date = new Date(time);
		let hour = date.getHours();
		let minute = date.getMinutes();
		return `${hour<10 ? '0'+hour : hour}:${minute<10 ? '0'+minute : minute}`;
	}

}

export default MsgPanel;