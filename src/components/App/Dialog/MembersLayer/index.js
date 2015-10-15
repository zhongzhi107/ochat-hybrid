import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../utils/dom.js';


class MembersLayer extends React.Component {

	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./MembersLayer.less');
		}
	}

	componentDidMount() {
		document.addEventListener('click', (e) => {
			if (this.props.active) {
				let target = $.closest(e.target, '.membersLayer') || $.closest(e.target, '.profileLayer') || $.closest(e.target, '.chatMembersBtn');
				if (target == null) {
					this.props.hideMembersLayer();
				}
			}
		}, false);
	}

	render () {
		let {active, sessionAttr} = this.props;
		let members = sessionAttr && sessionAttr.members;
		let memberNodes = members && members.map((elem, index) => {
			return (
				<div id={`profile-${elem.id}`} key={`profile-${elem.id}`} 
					className="member" onClick={(e) => this.showProfileInfo(e)}>
					<img src={elem.img} />
					<p>{elem.name}</p>
				</div>
			);
		}) || null;

		return (
			<div className={active ? 'membersLayer' : 'membersLayer hidden'}>
				<div>
					<div className="member add" title="添加群成员" onClick={(e) => this.addMembers(e)}></div>
					{memberNodes}
				</div>
			</div>
		);
	}

	showProfileInfo(e) {
		let target = $.closest(e.target, '.member');
		let uId = target.id.split('-')[1];
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

	addMembers(e) {
		let {active, ...originAttr} = this.props;
		this.props.hideMembersLayer();
		this.props.showContactsLayer(originAttr);
	}

}

export default MembersLayer;
