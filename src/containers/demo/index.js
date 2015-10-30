'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initDemo, updateDemo } from './actions';
import http from 'utils/http';
import classNames from 'classnames';
import Tips from 'components/tips';
import './demo.less';

@connect(state => (state))
export default class DemoPage extends Component {

  constructor() {
		super();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    http.get('/api/friendship').then((data) => {
      dispatch(initDemo(data));
    });
  }

  render() {
    const { data } = this.props;
    let buttonText = ['添加好友', '通过验证', '发送消息'];
    return (
      <div id="demo">
        <div className="base box">
          <div className="avatar"></div>
          <div className="detail">
            <h3>
              <span>{data.remarkName}</span>
              <span className={classNames('gender', ['male', 'female'][data.gender-1])}></span>
            </h3>
            <p>
              <span>账号7：</span>
              <span>{data.username}</span>
            </p>
          </div>
        </div>
        <div className="extend box">
          <dl>
            <dt>等级</dt>
            <dd className="clearfix">{data.level}</dd>
            <dt>淘龄</dt>
            <dd>{data.age}</dd>
          </dl>
        </div>
        <div className="buttons">
          <button className="green-button" onClick={::this.buttonClick}>
          {buttonText[data.relation]}
          </button>
        </div>
        {this.renderTips(data.tips)}
      </div>
    );
  }

  buttonClick() {
    const { dispatch } = this.props;
    dispatch(updateDemo());
  }

  renderTips(showTips) {
    if (showTips) {
      return (
        <Tips>操作已成功</Tips>
      );
    }
  }
}
