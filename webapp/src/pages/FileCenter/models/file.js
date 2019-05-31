import { ruleFriends, exchageSendOut, exchageSendIn } from '@/services/file';
  
  // 文件中心
  export default {
    namespace: 'file',
  
    state: {

    },
  
    effects: {
      // 接收人
      *getFriends({ payload, callback }, { call }) {
        const response = yield call(ruleFriends, payload);
        if (callback) callback(response);  // 后端返回回调
      },

      // 已发送
      *getExchageSendOut({ payload }, { call, put }) {
        const response = yield call(exchageSendOut, payload);
        const result = {
          list: response.data.content,
          pagination: {
            total: response.data.totalElements,
            pageSize: response.data.size,
            current: response.data.number,
          },
        };
        yield put({
          type: 'saveSendOut',
          payload: result,
        })
      },
  
      // 已收取
      *getExchageSendIn({ payload }, { call, put }) {
        const response = yield call(exchageSendIn, payload);
        const result = {
          list: response.data.content,
          pagination: {
            total: response.data.totalElements,
            pageSize: response.data.size,
            current: response.data.number,
          },
        };
        yield put({
          type: 'saveSendOut',
          payload: result,
        })
      },
    },
  
    reducers: {
      // 已发送
      saveSendOut(state, action) {
        return {
          ...state,
          dataList: action.payload,
        };
      },
  
    },
  
  };
  