import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../utils/dom.js';


class ProfileLayer extends React.Component {

	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./ProfileLayer.less');
		}
	}

	componentDidMount() {
		document.addEventListener('click', (e) => {
			if (this.props.active) {
				let target = $.closest(e.target, '.profileLayer') || $.closest(e.target, '.member') || $.closest(e.target, '.usericon');
				if (target == null) {
					this.props.hideProfileLayer();
				}
			}
		}, false);
	}

	componentDidUpdate() {
		if(!this.props.profileInfo.contact && !this.props.profileInfo.self) {
			this.closeAddContact();
		}
	}

	render () {
		let buttonNode = this.props.profileInfo.contact ?
			(<div className="button">
				<a className="btn sendMessage" onClick={(e) => this.sendMessage(e)} title="发送消息"></a>
			</div>) :
			(<div className="button">
				<a ref="btnAddContact" className="btn addContact" onClick={(e) => this.addContact(e)} title="添加好友"></a>
				<a ref="btnCloseAddContact" className="btn close hide" onClick={(e) => this.closeAddContact(e)} title="收起"></a>
			</div>);
		if(this.props.profileInfo.self) { // 如果是自己，则不显示任何按钮
			buttonNode = null;
		}
		let addContactNode = this.props.profileInfo.contact ? null :
			<div className="addContactPanel">
				<h2>添加好友</h2>
				<input ref="remark" placeholder="验证信息" />
				<a className="sendAddContact" onClick={(e) => this.sendAddContact(e)} title="发送请求">发送</a>
			</div>;

		return (
			<div ref="profileLayer" className={this.props.active ? 'profileLayer' : 'hide'} style={{top:this.props.position.top, left:this.props.position.left}}>
				<div className="icon">
					<img src={this.props.profileInfo.img} alt="" />
				</div>
				<div className="info">
					{buttonNode}
					<h2>{this.props.profileInfo.name}</h2>
				</div>
				{addContactNode}
			</div>
		);
	}

	sendMessage(e) {
		let sId = this.props.profileInfo.id;
		this.props.switchSession(sId);
	}

	addContact(e) {
		$.addClass(this.refs.profileLayer.getDOMNode(),'long');
		$.addClass(this.refs.btnAddContact.getDOMNode(),'hide');
		$.removeClass(this.refs.btnCloseAddContact.getDOMNode(),'hide');
	}

	closeAddContact(e) {
		$.removeClass(this.refs.profileLayer.getDOMNode(),'long');
		$.removeClass(this.refs.btnAddContact.getDOMNode(),'hide');
		$.addClass(this.refs.btnCloseAddContact.getDOMNode(),'hide');
	}

	sendAddContact(e) { // 发送好友申请
		let req = {
			data: {
				t: 21,
				frm: 'self',
				to: this.props.profileInfo.id,
				des: this.refs.remark.getDOMNode().value
			},
			notice: {
				t: 21,
				h1: '已发送好友申请',
				autoDisappear: 3000
			}
		}
		this.props.request(req);
	}


}

export default ProfileLayer;
