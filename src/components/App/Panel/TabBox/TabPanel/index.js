import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import MsgPanel from './MsgPanel';
import ContactPanel from './ContactPanel';


class TabPanel extends React.Component {
	
	constructor() {
		super();
		this.panels = [
			'MsgPanel',
			'ContactPanel'
		]
		this.active = {
			MsgPanel: false,
			ContactPanel: false
		}
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./TabPanel.less');
		}
	}

	render () {
		let currentTab = this.props.data.currentTab;
		this.panels.forEach((elem) => {
			this.active[elem] = false;
		});
		this.active[this.panels[currentTab]] = true;
		return (
			<div className="tabPanel">
				<MsgPanel active={this.active.MsgPanel} data={this.props.data} 
					switchSession={(e) => this.props.switchSession(e)} />
				<ContactPanel active = {this.active.ContactPanel} data={this.props.data}
					switchContact={(e) => this.props.switchContact(e)} />
			</div>
		);
	}

}

export default TabPanel;