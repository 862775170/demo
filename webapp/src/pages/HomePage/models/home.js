import { 
  fileCount, 
  ruleFriends,
  newestSendOut,
  newestSendIn,
  trends,
} from '@/services/home';

// 首页
export default {
  namespace: 'homePage',

  state: {
    trendsData: [],  // 最新动态
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

    // 最新发送文件
    *getNewestSendOut({ payload, callback }, { call }) {
      const response = yield call(newestSendOut, payload);
      const result = {
        list: response.data.content,
        pagination: {
          total: response.data.totalElements,
          pageSize: response.data.size,
          current: response.data.number,
        },
      };
      if (callback) callback(result);  
    },

    // 最新接收文件
    *getNewestSendIn({ payload, callback }, { call }) {
      const response = yield call(newestSendIn, payload);
      const result = {
        list: response.data.content,
        pagination: {
          total: response.data.totalElements,
          pageSize: response.data.size,
          current: response.data.number,
        },
      };
      if (callback) callback(result);
    },

    // 最新动态
    *getTrends({ payload }, { call, put }) {
      const response = yield call(trends, payload);
      yield put({
        type: 'saveList',
        payload: {
          trendsData: response.data.content,
        },
      }); 
    },
    
  },

  reducers: {
    // 最新动态
    saveList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    clear() {
      return {
        trendsData:[],   // 最新动态
      };
    },

  },

};
