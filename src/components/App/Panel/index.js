import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import StateBar from './StateBar';
import TabBox from './TabBox';
import Notice from './Notice';


class Panel extends React.Component {
	
	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./Panel.less');
		}
	}

	render () {
		return (
			<div className="panel">
				<StateBar profile={this.props.data.profile} 
					toggleSound={(e) => this.props.toggleSound(e)}
          showContactsLayer={(e) => this.props.showContactsLayer(e)}
					logout={(e) => this.props.logout()}/>
				<TabBox tabs={this.props.tabs} data={this.props.data} 
					switchTab={(e) => this.props.switchTab(e)} 
					switchSession={(e) => this.props.switchSession(e)}
					switchContact={(e) => this.props.switchContact(e)}/>
				<Notice notice={this.props.data.notice}
					shiftNotice={(e) => this.props.shiftNotice(e)}
					setFriends={(e) => this.props.setFriends(e)}
					request={(e) => this.props.request(e)}/>
			</div>
		);
	}

}

export default Panel;