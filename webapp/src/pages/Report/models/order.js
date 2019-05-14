import {
  getCustProductAdd,
  getOrderTotal,
  getOrderAdd,
  getOrderDel,
} from '@/services/report';

export default {
  namespace: 'order',

  state: {
    loading: false,
    options: [],
    orderTotal: [],
    orderAdd: [],
    orderDel: [],
  },

  effects: {
    * getOptions(payload, {
      call,
      put
    }) {
      const response = yield call(getCustProductAdd, payload);
      response.data.productTypeList.unshift({
        productId: "0",
        productName: "总体"
      });
      yield put({
        type: 'saveOptions',
        payload: response.data.productTypeList,
      });
    },

    * getOrderTotal(payload, {
      call,
      put
    }) {
      const response = yield call(getOrderTotal, payload);
      response.fields = response.data.typeList.map(item => item.type);
      response.orderTotalData = response.data.productList
        .map(item => {
          return {
            name: item.product
          }
        });
      response.orderTotalData.forEach(element => {
        const e = element;
        response.data.dataList.forEach(element2 => {
          const item = element2;
          if (item.product === e.name) {
            e[item.type] = item.count;
          }
        });
      });
      yield put({
        type: 'saveOrderTotal',
        payload: response,
      });
    },

    * getOrderAdd(payload, {
      call,
      put
    }) {
      const response = yield call(getOrderAdd, payload);

      response.srcData = []
      response.data.dataList.forEach(
        element => {
          const e = element;
          if (e.product !== "总体") {
            // e.showName = e.product;
            response.srcData.push(e);
          }
        }
      );
      yield put({
        type: 'saveOrderAdd',
        payload: response.srcData,
      });
    },

    * getOrderDel(payload, {
      call,
      put
    }) {
      const response = yield call(getOrderDel, payload);
      response.srcData = []
      response.data.dataList.forEach(
        element => {
          const e = element;
          if (e.product !== "总体") {
            // e.showName = e.product;
            response.srcData.push(e);
          }
        }
      );
      yield put({
        type: 'saveOrderDel',
        payload: response.srcData,
      });
    },

  },

  reducers: {
    saveOptions(state, action) {
      return {
        ...state,
        options: action.payload,
      };
    },
    saveOrderTotal(state, action) {
      return {
        ...state,
        orderTotal: action.payload,
      };
    },
    saveOrderAdd(state, action) {
      return {
        ...state,
        orderAdd: action.payload,
      };
    },
    saveOrderDel(state, action) {
      return {
        ...state,
        orderDel: action.payload,
      };
    },
  },
};
