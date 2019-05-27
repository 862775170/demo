import { 
  ruleFriends, 
  ruleRelation,
} from '@/services/search';

//搜索
export default {
  namespace: 'search',

  state: {
    ruleList: [],   //存储好友中心  好友列数据 
  },

  effects: {
    // 好友中心 好友列
    *getFriends({ payload, callback }, { call }) {
      const response = yield call(ruleFriends, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // 好友中心 规则
    *getRuleRelation({ payload }, { call, put }) {
      const response = yield call(ruleRelation, payload);
      yield put({
        type: 'saveRuleList',
        payload: response.data,
      });
    },

    
  },

  reducers: {
    // 好友中心 规则
    saveRuleList(state, action) {
      return {
        ...state,
        ruleList: action.payload,
      };
    },

  },

};
