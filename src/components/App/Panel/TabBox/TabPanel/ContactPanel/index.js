import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../../../utils/dom.js';


class ContactPanel extends React.Component {
	
	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./ContactPanel.less');
		}
	}

	render () {
		let {profile, currentContactId} = this.props.data;
		let contacts = profile.contacts;
		let contactNodes = contacts && contacts.map((elem, index) => {
			if(elem.letter) { // 字母
				return (
					<div key={`contact-group-${index}`} className="contact group">
						<h3>{elem.letter}</h3>
					</div>
				);
			} else { // 联系人
				return (
					<div id={`contact-${elem.id}`} key={`contact-${elem.id}`} 
						className={currentContactId === elem.id ? 'contact active' : 'contact'}
						onClick={(e) => this.switchContact(e)}>
						<img src={elem.img} alt="" />
						<h4>{elem.name}</h4>
					</div>
				);
			}
		}) || null;
		return (
			<div className={this.props.active? 'contactPanel' : 'contactPanel hide'}>
				{contactNodes}
			</div>
		);
	}

	switchContact(e) {
		let target = $.closest(e.target, '.contact');
		let contactId = target.getAttribute('id');
		contactId = contactId.split('-')[1];
		this.props.switchContact(contactId);
	}

}

export default ContactPanel;