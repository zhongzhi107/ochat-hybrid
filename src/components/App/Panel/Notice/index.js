import React from 'react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import _ from 'lodash';


class Notice extends React.Component {
	
	constructor() {
		super();
		this.config = {
			// t: 0,
			// img: '',
			// h1: '',
			// h2: '',
			// length: '',
			// btnOk: '确定',
			// btnCancel: '取消',
			btnClose: true,
			autoDisappear: 0
		}
	}

	componentWillMount() {
		if (canUseDOM) {
			require('./Notice.less');
		}
	}

	componentDidUpdate() {
	}

	setCloseTimer(time) {
		setTimeout(() => this.closeNotice(), time);
	}

	setOpenTimer(time) {
		setTimeout(() => this.openNotice(), time);
	}

	render () {
		let length = this.props.notice.length;
		let config = {};
		if(length) {
			config = _.assign(config, this.config, this.props.notice[0]);
			switch(config.t) {
				case 0:  // 一般通知 5秒后消失
					config.length = length;
					config.autoDisappear = 5000;
					break;
				case 23: // 申请好友通知
					config.length = length;
					config.btnOk = '同意';
					config.btnCancel = '忽略';
					break;
				case 25: // 同意添加好友成功通知
				case 26: // 添加好友成功通知
					config.autoDisappear = 5000;
					break;
			}
		}

		if(config.autoDisappear > 0) {
			this.setCloseTimer(config.autoDisappear + 1000);
		}
		if(length > 0) {
			this.setOpenTimer(200);
		}

		return (
			<div ref="notice" key={`notice-${length}`} className="notice">
				<div className="head">
					{config.btnClose ? <div className="btnClose" onClick={(e) => this.closeNotice(e)}></div> : null}
					{config.length ? <span className="length">您有 {config.length} 条新消息！</span> : null}
				</div>
				<div className="body">

					{config.img ? <img src={config.img} /> : null}

					{['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag, index) => {
						if(config[tag]) {
							return (<div key={`header-${tag}`} className={tag}>
												{[].concat(config[tag]).map((elem) => {
													return React.createElement(tag, {key: `${elem}-${index}`}, elem);
												})}
											</div>);
						}
					})}

					{(config.btnOk || config.btnCancel) ? 
						<div className="btns">
							{config.btnOk ? <a onClick={(e) => this.handleClickOk(e)}>{config.btnOk}</a> : null}
							{config.btnCancel ? <a onClick={(e) => this.handleClickCancel(e)}>{config.btnCancel}</a> : null}
						</div> 
						: null 
					}

				</div>
				<div className={config.h1 ? 'foot' : 'hide'}></div>
			</div>
		);
	}

	closeNotice(e) {
		this.refs.notice.getDOMNode().className = 'notice';
		setTimeout(() => {
			this.props.shiftNotice();
		}, 1200);
	}

	openNotice(e) {
		this.refs.notice.getDOMNode().className = 'notice active';
	}

	handleClickCancel(e) {
		this.closeNotice(e);
	}

	handleClickOk(e) {
		let notice = this.props.notice[0];
		switch(notice.t) {
			case 23: // 同意好友申请
				let req = {
					data: {
						t: 24,
						frm: getState().profile.uId,
						to: notice.id
					},
					callback: () => {
						this.props.setFriends();
					}
				}
				this.props.request(req);
			default: 
				this.closeNotice(e);
		}
	}




}

export default Notice;