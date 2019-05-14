import { 
  getTableData, 
  removeItem, 
  add, 
  update, 
} from '@/services/demo';

export default {
  namespace: 'demo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 获取表格数据
    *getTableData({ payload }, { call, put }) {
      const response = yield call(getTableData, payload);
      const result = {
        list: response.data.records,
        pagination: {
          total: response.data.total,
          pageSize: response.data.size,
          current: response.data.current,
        },
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },

    // 删除
    *removeItem({ payload, callback }, { call }) {
      const response = yield call(removeItem, payload);
      if (callback) callback(response);
    },

    // 新增
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },

    // 修改
    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
    },
    
  },

  // 更新数据模型
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
