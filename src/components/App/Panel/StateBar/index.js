import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../utils/dom.js';


class StateBar extends React.Component {

	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./StateBar.less');
		}
	}

	componentDidMount() {
		document.addEventListener('click', (e) => {
			if (!$.hasClass(this.refs.menu.getDOMNode(), 'hide')) {
				let target = $.closest(e.target, '.menu') || $.closest(e.target, '.menuIcon');
				if (target == null) {
					$.addClass(this.refs.menu.getDOMNode(), 'hide');
				}
			}
		}, false);
	}

	render () {
		return (
			<div id={`profile-${this.props.profile.uId}`} className="statebar">
				<img src={this.props.profile.img} alt="" />
				<h2>{this.props.profile.name}</h2>
				<div className="menuIcon" title="菜单" onClick={(e) => this.toggleMenu(e)}></div>
				<div ref="menu" className="menu hide">
					<ul>
						<li onClick={(e) => this.beginChat(e)}><div className="menu-item-0"></div>发起聊天</li>
						<li data-status="not-muted" onClick={(e) => this.toggleSound(e)}><div className="menu-item-1"></div>关闭声音</li>
						<li onClick={(e) => this.logout(e)}><div className="menu-item-2"></div>退出</li>
					</ul>
				</div>
			</div>
		);
	}

	toggleMenu(e) {
		if($.hasClass(this.refs.menu.getDOMNode(), 'hide')) {
			$.removeClass(this.refs.menu.getDOMNode(), 'hide');
		} else {
			$.addClass(this.refs.menu.getDOMNode(), 'hide');
		}
	}

	beginChat(e) {
    this.props.showContactsLayer();
	}

	toggleSound(e) {
		let target = $.closest(e.target, 'li');
		let status = target.getAttribute('data-status');
		if(status === 'not-muted') { //原来是打开声音的，点击后关闭声音
			target.setAttribute('data-status', 'muted');
			target.innerHTML = target.innerHTML.replace('打开', '关闭');
		} else {
			target.setAttribute('data-status', 'not-muted');
			target.innerHTML = target.innerHTML.replace('关闭', '打开');
		}
		this.props.toggleSound();
	}

	logout(e) {
		this.props.logout();
	}

}

export default StateBar;
