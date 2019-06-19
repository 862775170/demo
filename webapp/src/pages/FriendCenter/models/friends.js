import { 
  ruleFriends, 
  ruleRelation,
  sender,
  receiver,
  ruleReceive,
  fileList,
  submitRule,
  ruleUpdate,
  ruleConfirmUpdate,
  userDelete,
} from '@/services/friends';

// 规则中心
export default {
  namespace: 'friend',

  state: {
    ruleList: [],   // 存储好友中心  好友列数据 
  },

  effects: {
    // 好友中心 好友列
    *getFriends({ payload, callback }, { call }) {
      const response = yield call(ruleFriends, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // 好友中心 发送规则
    *getRuleRelation({ payload }, { call, put }) {
      const response = yield call(ruleRelation, payload);
      yield put({
        type: 'saveRuleList',
        payload: response.content,
      });
    },

    // 好友中心 接收规则
    *getRuleReceive({ payload }, { call, put }) {
      const response = yield call(ruleReceive, payload);
      yield put({
        type: 'saveRuleList',
        payload: response.content,
      });
    },

    // 源路径
    *getFileList({ payload, callback }, { call }) {
      const response = yield call(fileList, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    //  新建规则  提交 借口
    *getSubmitRule({ payload, callback }, { call }) {
      const response = yield call(submitRule, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // 发送规则  编辑
    *getRuleUpdate({ payload, callback }, { call }) {
      const response = yield call(ruleUpdate, payload);
      if (callback) callback(response);  // 后端返回回调
    },
    // 发送规则  删除
    *getUserDelete({ payload, callback }, { call }) {
      const response = yield call(userDelete, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // 接收规则 编辑
    *getRuleConfirmUpdate({ payload, callback }, { call }) {
      const response = yield call(ruleConfirmUpdate, payload);
      if (callback) callback(response);  // 后端返回回调
    },

    // 已发送
    *getSender({ payload }, { call, put }) {
      const response = yield call(sender, payload);
      yield put({
        type: 'saveRuleList',
        payload: response.data,
      });
    },

    // 已收取
    *getReceiver({ payload }, { call, put }) {
      const response = yield call(receiver, payload);
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
