import { 
    exchageSendOut, 
    exchageSendIn,
  } from '@/services/task';
  
  //任务中心
  export default {
    namespace: 'task',
  
    state: {

    },
  
    effects: {
      // 已发送
      *getExchageSendOut({ payload }, { call, put }) {
        const response = yield call(exchageSendOut, payload);
        yield put({
            type: 'saveSendOut',
            payload: response.data,
        });
      },
  
      // 已收取
      *getExchageSendIn({ payload }, { call, put }) {
        const response = yield call(exchageSendIn, payload);
        yield put({
          type: 'saveSendOut',
          payload: response.data,
        });
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
  