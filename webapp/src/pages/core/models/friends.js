import { 
  friends, 
  ruleConfirmRule,
} from '@/services/friends';

//规则中心
export default {
  namespace: 'friends',

  state: {
    friendsData: [],   //存储好友中心  好友列数据 
  },

  effects: {
    // 好友中心 好友列
    *getFriends({ payload, callback }, { call }) {
      const response = yield call(friends, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // -------------
    *getRuleConfirmRule({ payload, callback }, { call }) {
      const response = yield call(ruleConfirmRule, payload);
      yield put({
        type: 'saveFriendsList',
        payload: response.data,
      });
    },

    reducers: {
      // ------
      saveFriendsList(state, action) {
        return {
          ...state,
          friendsData: action.payload,
        };
      },
    }

  },
};
