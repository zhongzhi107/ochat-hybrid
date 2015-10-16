'use strict';

import React, {Component} from 'react';
import http from '../../core/HttpClient';
import classNames from 'classnames';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

class DemoPage extends Component {

  constructor() {
		super();
    this.state = {};
  }

  componentWillMount() {
    if (canUseDOM) {
      require('./demo.less');
    }
  }

  componentDidMount() {
    http.get('/api/friendship').then((data) => {
      this.setState(data);
    });
  }

  render() {

    return (
      <div id="demo">
        <div className="base box">
          <div className="avatar"></div>
          <div className="detail">
            <h3>
              <span>{this.state.remarkName}</span>
              <span className={classNames('gender', ['male', 'female'][this.state.gender-1])}></span>
            </h3>
            <p>
              <span>账号：</span>
              <span>{this.state.username}</span>
            </p>
          </div>
        </div>
        <div className="extend box">
          <dl>
            <dt>等级</dt>
            <dd className="clearfix">{this.state.level}</dd>
            <dt>淘龄</dt>
            <dd>{this.state.age}</dd>
          </dl>
        </div>
        <div className="buttons">
          <button className="green-button" onClick={this.buttonClick.bind(this)}>
          {['添加好友', '通过验证', '发送消息'][this.state.relation]}
          </button>
        </div>
      </div>
    );
  }

  buttonClick() {
    console.log(this);
  }
}

export default DemoPage;
