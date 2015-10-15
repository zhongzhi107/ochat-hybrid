import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import _ from 'lodash';
import AppStore from '../../../stores/AppStore.js';
import $ from '../../../utils/dom.js';


class ContactsLayer extends React.Component {
	
	constructor() {
		super();
		this.btnOk = '确 定';
		this.originChoosed = [];
		this.choosed = [];
		this.choosedLength = 0;
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./ContactsLayer.less');
		}
	}

	render () {
		if(this.props.originAttr) { // 由membersLayer打开
			let originMembers = this.props.originAttr.sessionAttr.members;
			if(originMembers && originMembers.length > 0) {
				this.btnOk = '添 加';
			}
			this.originChoosed = originMembers;
		}

		let choosedContacts = [].concat(this.originChoosed, this.choosed);

		let choosedContactsNodes = choosedContacts.length > 0 ? 
			choosedContacts.map((elem, index) => {
				return 	(<div key={`l-member-${elem.id}`} id={`l-member-${elem.id}`} 
									className="member" 
									onClick={(e) => this.removeMember(e)}>
									<img src={elem.img} />
								</div>);
			}) :
			<div className="noMembers">
				未选择联系人
			</div>;

		let contacts = this.props.data.profile.contacts;

		let contactsNodes = contacts && contacts.length > 0 ? 
			contacts.map((elem, index) => {
				let checked = _.findIndex(choosedContacts, (chr) => {return chr.id === elem.id;});
				return 	(<div key={`l-contact-${elem.id}`} id={`l-contact-${elem.id}`} 
									className={checked > -1 ? 'contact active' : 'contact'}
									onClick={(e) => this.checkContact(e)} >
									<div className="checkbox"></div>
									<div className="info">
										<img src={elem.img} />
										<h2>{elem.name}</h2>
									</div>
								</div>);
			}) : 
			<div className="noContacts">
				您还没有添加好友。
			</div>;

		return (
			<div ref="contactsLayer" className={this.props.active ? 'contactsLayer' : 'hide'}>
				<div className="contactsMask"></div>
				<div className="contactsContainer">
					<div className="title">
						<div className="btnClose" onClick={(e) => this.closeLayer(e)}></div>
						<h1>选择联系人</h1>
					</div>
					<div className="choosed">
						{choosedContactsNodes}
					</div>
					<div className="contacts">
						{contactsNodes}
					</div>
					<div className="btns">
						<a className={this.choosed.length + this.originChoosed.length > 0 ? 'btnOk' : 'btnOk forbid'}
							onClick={(e) => this.handleBtnOk(e)} >{this.btnOk}</a>
					</div>
				</div>
			</div>
		);
	}

	closeLayer(e) {
		this.originChoosed = [];
		this.choosed = [];
		this.props.hideContactsLayer(e);
	}

	checkContact(e) {
		let target = $.closest(e.target, '.contact');
		let id = target.getAttribute('id').split('-')[2];
		if($.hasClass(target, 'active')) {
			let removeIndex = _.findIndex(this.choosed, (chr) => {return chr.id === id;});
			if(removeIndex > -1) {
				this.choosed.splice(removeIndex, 1);
			}
		} else {
			let contact = AppStore.findContacts(id);
			this.choosed = this.choosed.concat(contact);
		}
		this.forceUpdate();
	}

	removeMember(e) {
		let target = $.closest(e.target, '.member');
		let id = target.getAttribute('id').split('-')[2];
		let removeIndex = _.findIndex(this.choosed, (chr) => {return chr.id === id;});
		if(removeIndex > -1) {
			this.choosed.splice(removeIndex, 1);
		}
		this.forceUpdate();
	}

	handleBtnOk(e) {
		let frm = this.props.data.profile.uId; // 自己的id
		//除自己外选中的人
		let selectedMembers = this.choosed.concat(this.originChoosed);
		let removeIndex = _.findIndex(selectedMembers, (chr) => {return chr.id === frm;});
		if(removeIndex > -1) {
			selectedMembers.splice(removeIndex, 1);
		}
		selectedMembers = _.uniq(selectedMembers, 'id');
		if(selectedMembers.length === 0) { // 除自己外一个人没选中，则直接返回
			return;
		}

		let oldSessionId = null;
		if(this.props.originAttr) { // 由添加群成员按钮触发； 若非由此，则由菜单-发起聊天按钮触发
			let {sessionId, sessionMode} = this.props.originAttr;
			if(sessionMode === 2) { // 当前为群聊天，则往群里加人; 若非群聊天，则发起新聊天
				oldSessionId = sessionId;
			}
		}

		if(oldSessionId) { // 添加群成员(修改群属性)
			selectedMembers = _.without(selectedMembers, ...this.originChoosed);
			if(selectedMembers.length === 0) { // 成员数量没有变化，直接返回
				this.closeLayer(e);
				return;
			}
			let add = selectedMembers.map((elem, index) => {
				return elem.id;
			});
			let req = {
				data: {
					t: 9,
					sId: oldSessionId,
					uId: this.props.data.profile.uId,
					alter: {
						add: add
					}
				},
				notice: {
					t: 9,
					h1: '群成员添加成功',
					autoDisappear: 3000
				},
				callback: () => {
					this.props.setAttr(oldSessionId);
				}
			}
			this.props.request(req);
		} else { // 发起新聊天
			let toList = selectedMembers.map((elem, index) => {
				return elem.id;
			});
			if(toList.length === 1) { // 只选中了一人 => 单聊
				// let req = {
					// data: {
					// 	t: 5,
					// 	frm: frm,
					// 	to: toList[0]
					// }
				// }
				// this.props.request(req);
				this.props.switchSession(toList[0]);
			} else { // 选中了两人以上 => 群聊
				let req = {
					data: {
						t: 3,
						frm: frm,
						toList: toList
					},
					notice: {
						t: 3,
						h1: '您已创建新的群聊',
						autoDisappear: 3000
					},
					callback: (res) => {
						console.log('建群成功', res);
						this.props.unshiftSession(res.sId);
						this.props.setAttr(res.sId);
					}
				}
				this.props.request(req);
			}
		}
		this.closeLayer(e);
	}

}

export default ContactsLayer;