import {
  getCustProductAdd,
  getCustService,
  getServiceProduct,
  getServiceProductAdd,
  getServiceRegionAdd,
} from '@/services/report';

export default {
  namespace: 'service',

  state: {
    loading: false,
    options: [],
    custService: [],
    serviceProduct: [],
    serviceProductAdd: [],
    serviceRegionAdd: [],
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

    * getCustService(payload, {
      call,
      put
    }) {
      const response = yield call(getCustService, payload);
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
        type: 'saveCustService',
        payload: response,
      });
    },

    * getServiceProduct(_, {
      call,
      put
    }) {
      const response = yield call(getServiceProduct);

      yield put({
        type: 'saveServiceProduct',
        payload: response.data,
      });
    },

    * getServiceProductAdd(payload, {
    call,
    put
  }) {
    const response = yield call(getServiceProductAdd, payload);
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
      type: 'saveServiceProductAdd',
      payload: response.pAddGroupBarData,
    });
  },

  * getServiceRegionAdd(payload, {
    call,
    put
  }) {
    const response = yield call(getServiceRegionAdd, payload);
    response.rAddGroupBarData = response.data.reportList.filter(
      element => element.companyAbbr !== '总计'
    );
    yield put({
      type: 'saveServiceRegionAdd',
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
    saveCustService(state, action) {
      return {
        ...state,
        custService: action.payload,
      };
    },
    saveServiceProduct(state, action) {
      return {
        ...state,
        serviceProduct: action.payload,
      };
    },
    saveServiceProductAdd(state, action) {
      return {
        ...state,
        serviceProductAdd: action.payload,
      };
    },
    saveServiceRegionAdd(state, action) {
      return {
        ...state,
        serviceRegionAdd: action.payload,
      };
    },
    
    

  },
};
