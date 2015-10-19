'use strict';

import React, {Component, PropTypes} from 'react';
import {readonly} from 'core-decorators';
import './tips.less';

export default class Tips extends Component {

  @readonly
  static propTypes = {
    children: PropTypes.string.isRequired
  }

  static defaultProps = {
    prefixCls: 'q-tips'
  }

  render() {
    return (
      <div className={this.props.prefixCls}>{this.props.children}</div>
    );
  }
};
