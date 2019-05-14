import { 
  getProductList,
} from '@/services/product';

export default {
  namespace: 'product',

  state: {
    data: [],
    dataTask: [],
  },

  effects: {
    // 产品管理列表
    *productList(payload, { put, call }) {
      const resp = yield call(getProductList);
      yield put({
        type: "saveProductList",
        payload: resp.data
      })
    },
  },

  reducers: {
    // 产品管理列表
    saveProductList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};