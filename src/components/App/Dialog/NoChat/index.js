import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';


class NoChat extends React.Component {
	
	constructor() {
		super();
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./NoChat.less');
		}
	}

	render () {
		return (
			<div className={this.props.active ? 'noChat' : 'hide'}>
				<p>{this.props.tips}</p>
			</div>
		);
	}

}

export default NoChat;