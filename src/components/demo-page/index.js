'use strict';

import React, {Component} from 'react';
import http from '../../utils/http';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import Tips from '../tips';
import './demo.less';

export default class DemoPage extends Component {

  constructor() {
		super();
    // this.buttonClick = this.buttonClick.bind(this);
    this.state = {};
  }

  componentDidMount() {
    http.get('/api/friendship').then((data) => {
      this.setState(data);
    });
  }

  render() {
    let buttonText = ['添加好友', '通过验证', '发送消息'];
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
          <button className="green-button" onClick={this.buttonClick}>
          {buttonText[this.state.relation]}
          </button>
        </div>
        {this.renderTips()}
      </div>
    );
  }

  @autobind
  buttonClick() {
    console.log(this);
    this.setState({
      tips: true
    });
  }

  renderTips() {
    if (this.state.tips === true) {
      return (
        <Tips>操作已成功</Tips>
      );
    }
  }
}
