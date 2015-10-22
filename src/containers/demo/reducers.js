'use strict';

import assign from 'object-assign';
import { combineReducers } from 'redux';
import { INIT_DEMO, UPDATE_DEMO } from './actions';

const initialState = {
  userId: '',
  remarkName: '',
  username: '',
  avatar: '',
  level: '',
  age: '',
  gender: '',
  relation: ''
};

// 此处的function名称对应着页面组件中的state数据名称
function data(state = initialState, action) {
  switch (action.type) {

    // 页面初始化
    case INIT_DEMO:
      return assign({}, action.data);

    // 点击按钮后数据更新
    case UPDATE_DEMO:
      return {
        ...state,
        tips: true
      };
      
    default:
      return state;
  }
}

export default combineReducers({
  data
});
