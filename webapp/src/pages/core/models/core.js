import { ruleTasks, ruleMyRule } from '@/services/core';

//规则中心
export default {
  namespace: 'core',

  state: {
    roleData: [],
    myData: []
  },

  effects: {

    // 待确认规则 列表
    *getRuleTasks({ payload }, { call, put }) {
      const response = yield call(ruleTasks, payload);
      yield put({
        type: 'saveUserList',
        payload: response.data,
      });
    },

    // 我的规则 全部列表接口
    *getRuleMyRule({ payload }, { call, put }) {
      const response = yield call(ruleMyRule, payload);
      yield put({
        type: 'saveMyList',
        payload: response.data,
      });
    },

    // 新建用户
    *userAdd({ payload, callback }, { call }) {
      const response = yield call(postUserAdd, payload);
      if (callback) callback(response);  // 后端返回回调
    },
    
  },

  reducers: {

    // 待确认规则 列表
    saveUserList(state, action) {
      const result= action.payload.map(d => {
        return {...d,...d.variables}}
      );
      return {
        ...state,
        coreData: result,
      };
    },

    //我的规则 全部列表接口
    saveMyList(state, action) {
      const result= action.payload.map(d => {
        return {...d,...d.variables}}
      );
      return {
        ...state,
        myData: result,
      };
    },

  },
};
