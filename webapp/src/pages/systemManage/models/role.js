import { getRoleList, getPermitsList, postRoleAdd, putRoleAdd } from '@/services/role'

export default {
  namespace: 'role',

  state: {
    data: [],
    roleData:[]
  },

  effects: {
    // 角色管理   角色列表接口
    *roleList(payload, { call, put }) {
      const response = yield call(getRoleList, payload);
      const result = {
        list: response.data.records,
      };
      yield put({
        type: 'reducersRoleList',
        payload: result.list,
      })
    },

    // 穿梭框查询数据接口
    *permitsList({ payload, callback }, { call }) {
      const response = yield call(getPermitsList, payload);
      if (callback) callback(response);
    },

    // 新建
    *roleAdd({ payload, callback }, { call }) {
      const response = yield call(postRoleAdd, payload);
      if (callback) callback(response);
    },

    // 修改
    *roleUpdate({ payload, callback }, { call }) {
      const response = yield call(putRoleAdd, payload);
      if (callback) callback(response);
    },

  },

  reducers: {
    // 角色管理   角色列表接口
    reducersRoleList(state, action) {
      return {
        ...state,
        roleData: action.payload,
      };
    },
  }

}
