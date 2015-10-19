'use strict';

import React, {Component, PropTypes} from 'react';
import {readonly} from 'core-decorators';
import './tips.less';

export default class Tips extends Component {

  @readonly
  static propTypes = {
    children: PropTypes.string.isRequired
  }

  render() {
    return (
      <div className={this.props.prefixCls || 'q-tips'}>{this.props.children}</div>
    );
  }
};
