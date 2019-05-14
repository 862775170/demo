import { 
  getMenuList, 
  getUserList,
  postUserAdd,
  postUserUpdate, 

  removeMenu, 
  addMenu, 
  updateMenu, 
  
} from '@/services/system';

export default {
  namespace: 'cust',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    // 系统管理-菜单管理
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMenuList, payload);
      const result = {
        list: response.data,
      };
      yield put({
        type: 'save',
        payload: result,
      });
    },
    // 用户管理 列表
    *userList({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      const result = {
        list: response.data.records,
        pagination: {
          total: response.data.total,
          pageSize: response.data.size,
          current: response.data.current,
        },
      };
      yield put({
        type: 'saveUserList',
        payload: result,
      });
    },
    // 新建用户
    *userAdd({ payload, callback }, { call }) {
      const response = yield call(postUserAdd, payload);
      if (callback) callback(response);  // 后端返回回调
    },
    // 修改用户
    *userUpdate({ payload, callback }, { call }) {
      const response = yield call(postUserUpdate, payload);
      if (callback) callback(response);
    },


    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMenu, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMenu, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMenu, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    // 系统管理-菜单管理
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    // 用户管理 列表接收后端返回数据
    saveUserList(state, action) {
      return {
        ...state,
        userData: action.payload,
      };
    },

    
  },
};
