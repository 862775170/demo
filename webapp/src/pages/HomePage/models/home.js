import { 
  fileCount, 
  ruleFriends,
  ruleTasks,
} from '@/services/home';

// 首页
export default {
  namespace: 'homePage',

  state: {
     
  },

  effects: {
    // 统计 本日 (发送、接收)  和  历史(发送、接收)  次数
    *getFleCount({ payload, callback }, { call }) {
      const response = yield call(fileCount, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // 好友人数
    *getFriends({ payload, callback }, { call }) {
      const response = yield call(ruleFriends, payload);
      if (callback) callback(response);  
    },

    // 待确认规则 个数
    *getRuleTasks({ payload, callback }, { call }) {
      const response = yield call(ruleTasks, payload);
      if (callback) callback(response);  
    },
    
  },

  reducers: {
    // ------
    saveRuleList(state, action) {
      return {
        ...state,
        ruleList: action.payload,
      };
    },

  },

};
