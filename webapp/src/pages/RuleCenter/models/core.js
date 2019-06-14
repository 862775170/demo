import { 
  ruleTasks, 
  ruleMyRule, 
  fileList,
  userGetRootGroup, 
  userlistAllGroupUser,
  submitRule,
  confirmRule,
  ruleConfirmRule,
  ruleDelete,
  ruleConfirmUpdate,
  ruleUpdate,
  ruleDetails,
  ruleConfirmDelete,
} from '@/services/core';

// 规则中心
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

    // 待确认规则  保存
    *getRuleConfirmRule({ payload, callback }, { call }) {
      const response = yield call(ruleConfirmRule, payload);
      if (callback) callback(response);  // 后端返回回调
    },



    // 我的规则      发送规则
    *getRuleMyRule({ payload }, { call, put }) {
      const response = yield call(ruleMyRule, payload);
      yield put({
        type: 'saveMyList',
        payload: response.data,
      });
    },
    // 发送规则  详情 修改
    *getRuleUpdate({ payload, callback }, { call }) {
      const response = yield call(ruleUpdate, payload);
      if (callback) callback(response);  // 后端返回回调
    },
    // 接收人员列表  查询
    *getRuleDetails({ payload, callback }, { call }) {
      const response = yield call(ruleDetails, payload);
      if (callback) callback(response);  
    },
    // 接收人员列表 修改提交
    *getRuleConfirmDelete({ payload, callback }, { call }) {
      const response = yield call(ruleConfirmDelete, payload);
      if (callback) callback(response);  
    },
    // 我的规则  删除
    *getRuleDelete({ payload, callback }, { call }) {
      const response = yield call(ruleDelete, payload);
      if (callback) callback(response);
    },

    // 我的规则      接收规则
    *getConfirmRule({ payload }, { call, put }) {
      const response = yield call(confirmRule, payload);
      yield put({
        type: 'saveMyList',
        payload: response.data,
      });
    },
    // 接收规则 详情
    *getRuleConfirmUpdate({ payload, callback }, { call }) {
      const response = yield call(ruleConfirmUpdate, payload);
      if (callback) callback(response);  // 后端返回回调
    },
    

    // 源路径
    *getFileList({ payload, callback }, { call }) {
      const response = yield call(fileList, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // 接收方 目录结构
    *getUserGetRootGroup({ payload, callback }, { call }) {
      const response = yield call(userGetRootGroup, payload);
      if (callback) callback(response);  // 后端返回回调
    },
    // 接收方 
    *getUserlistAllGroupUser({ payload, callback }, { call }) {
      const response = yield call(userlistAllGroupUser, payload);
      const {result } = response
      result.sort(({group:{group_name:group}},{group:{group_name:group1}}) => {
        return group.localeCompare(group1)
      })
      if (callback) callback(response);  // 后端返回回调
    },
    //  新建规则  提交 借口
    *getSubmitRule({ payload, callback }, { call }) {
      const response = yield call(submitRule, payload);
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

    // 我的规则 全部列表接口
    saveMyList(state, action) {
      const result= action.payload.map(d => {
        return {...d,...d.variables,...d.rule}}
      );
      return {
        ...state,
        myData: result,
      };
    },

  },
};
