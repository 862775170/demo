import {
  getFincloudCust,
  getFincloudProduct,
  getCustRegionAdd,
  getCustProductAdd,
} from '@/services/report';

export default {
  namespace: 'cust',

  state: {
    loading: false,
    fincloudCust: [],
    custProductAdd: [],
    custRegionAdd: [],
    fincloudProduct: [],
    options: [],
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

    * getFincloudCust(payload, {
      call,
      put
    }) {
      const response = yield call(getFincloudCust, payload);
      response.fields = response.data.companyCityList.map(item => item.companyAbbr);
      response.groupBarData = response.data.companyTypeList
        .map(item => {
          return {
            name: item.companyType
          }
        });
      response.groupBarData.forEach(element => {
        const e = element;
        response.data.reportList.forEach(element2 => {
          const item = element2;
          if (item.companyType === e.name) {
            e[item.companyAbbr] = item.num;
          }
        });
      });
      yield put({
        type: 'saveFincloudCust',
        payload: response,
      });
    },

    * getFincloudProduct(_, {
      call,
      put
    }) {
      const response = yield call(getFincloudProduct);

      yield put({
        type: 'saveFincloudProduct',
        payload: response.data,
      });
    },

    * getCustProductAdd(payload, {
      call,
      put
    }) {
      const response = yield call(getCustProductAdd, payload);
      response.data.productTypeList.unshift({
        productId: "0",
        productName: "总体"
      });
      const temp = [];
      response.data.productTypeList.forEach(e => {
        temp[e.productId] = e.productName;
      });
      response.pAddGroupBarData = []
      response.data.reportList.forEach(
        element => {
          const e = element;
          if (e.productId !== "0") {
            e.showName = temp[e.productId];
            response.pAddGroupBarData.push(e);
          }
        }
      );
      yield put({
        type: 'saveCustProductAdd',
        payload: response.pAddGroupBarData,
      });
    },

    * getCustRegionAdd(payload, {
      call,
      put
    }) {
      const response = yield call(getCustRegionAdd, payload);
      response.rAddGroupBarData = response.data.reportList.filter(
        element => element.companyAbbr !== '总计'
      );
      yield put({
        type: 'saveCustRegionAdd',
        payload: response.rAddGroupBarData,
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
    saveFincloudCust(state, action) {
      return {
        ...state,
        fincloudCust: action.payload,
      };
    },
    saveFincloudProduct(state, action) {
      return {
        ...state,
        fincloudProduct: action.payload,
      };
    },
    saveCustProductAdd(state, action) {
      return {
        ...state,
        custProductAdd: action.payload,
      };
    },
    saveCustRegionAdd(state, action) {
      return {
        ...state,
        custRegionAdd: action.payload,
      };
    },

  },
};
