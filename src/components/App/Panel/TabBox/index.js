import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import TabBar from './TabBar';
import TabPanel from './TabPanel';


class TabBox extends React.Component {
	
	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./TabBox.less');
		}
	}

	render () {
		return (
			<div className="tabBox">
				<TabBar tabs={this.props.tabs} currentTab={this.props.data.currentTab} 
					switchTab={(e) => this.props.switchTab(e)} />
				<TabPanel data={this.props.data} 
					switchSession={(e) => this.props.switchSession(e)}
					switchContact={(e) => this.props.switchContact(e)} />
			</div>
		);
	}

}

export default TabBox;