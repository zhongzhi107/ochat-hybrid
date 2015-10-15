'use strict';

import Dispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
  // 更新当前用户信息
  profileUpdate: (profile) => {
    Dispatcher.dispatch({
      actionType: ActionTypes.PROFILE_UPDATE,
      profile: profile
    });
  },

};
