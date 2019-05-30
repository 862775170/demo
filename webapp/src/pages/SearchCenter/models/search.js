import { 
  fileExchageSearch, 
} from '@/services/search';

// 搜索
export default {
  namespace: 'search',

  state: {
 
  },

  effects: {
    // 搜索
    *getFileExchageSearch({ payload }, { call, put }) {
      const response = yield call(fileExchageSearch, payload);
      const result = {
        list: response.data.content,
        pagination: {
          total: response.data.totalElements,
          pageSize: response.data.size,
          current: response.data.number,
        },
      };
      yield put({
        type: 'saveSearchList',
        payload: result,
      })
    },

  },

  reducers: {
    // 搜索
    saveSearchList(state, action) {
      console.log(state);
      console.log(action);
      return {
        ...state,
        searchData: action.payload,
      };
    },

  },

};
