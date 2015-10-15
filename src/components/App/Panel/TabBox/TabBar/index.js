import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import $ from '../../../../../utils/dom.js';


class TabBar extends React.Component {

	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./TabBar.less');
		}
	}

	render () {

		let tabNodes = this.props.tabs.map((elem, index) => {
			return (
				<div id={`tab-${index}`} key={`tab-${index}`} className={this.props.currentTab === index ? `tab tab-${index} active` : `tab tab-${index}`}
					onClick={(e) => this.switchTab(e)}>
					<div className="icon" title={elem}></div>
				</div>
			);
		})

		return (
			<div className="tabBar">
				<div className="tabWraper">
					{tabNodes}
				</div>
			</div>
		);
	}

	switchTab(e) {
		let index = $.closest(e.target, '.tab').id.split('-')[1];
		this.props.switchTab(index);
	}

}

export default TabBar;
