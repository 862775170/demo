import { 
  getRegionList,
} from '@/services/region';

export default {
  namespace: 'region',

  state: {
    data: [],
    dataTask: [],
  },

  effects: {
    // 区域管理列表
    *regionList(payload, { put, call }) {
      const resp = yield call(getRegionList);
      yield put({
        type: "saveRegionList",
        payload: resp.data
      })
    },
  },

  reducers: {
    // 区域管理列表
    saveRegionList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};