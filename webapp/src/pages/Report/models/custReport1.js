import {
  getFincloudCust,
  getFincloudProduct,
  getCustRegionAdd,
  getCustProductAdd,
  getPOCProductSum,
  getContractSum,
  getPocSum,
  getPocAdd,
  getOrderTotal,
  getOrderAdd,
  getOrderDel,
  getCustService,
  getServiceProduct,
  getServiceProductAdd,
  getServiceRegionAdd,
} from '@/services/report';

export default {
  namespace: 'custReport',

  state: {
    loading: false,
    fincloudCust: [],
    custProductAdd: [],
    custRegionAdd: [],
    POCProductSum: [],
    contractSum: [],
    pocSum: [],
    pocAdd: [],
    options: [],
    orderTotal: [],
    orderAdd: [],
    orderDel: [],
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

    * getPOCProductSum(payload, {
      call,
      put
    }) {
      const response = yield call(getPOCProductSum, payload);
      response.fields = response.data.contractTypeList.map(item => item.ContractType);
      response.data.productTypeList = response.data.productTypeList.filter(
        item => item.product !== "总体"
      );
      response.POCProductSumData = response.data.productTypeList
        .map(item => {
          return {
            name: item.product
          }
        });
      response.POCProductSumData.forEach(element => {
        const e = element;
        response.data.reportList.forEach(element2 => {
          const item = element2;
          if (item.product === e.name) {
            e[item.contractType] = item.count;
          }
        });
      });
      yield put({
        type: 'savePOCSum',
        payload: response,
      });
    },

    * getContractSum(_, {
      call,
      put
    }) {
      const response = yield call(getContractSum);

      yield put({
        type: 'saveContractSum',
        payload: response.data,
      });
    },

    * getPocSum(payload, {
      call,
      put
    }) {
      const response = yield call(getPocSum, payload);

      response.pocSumData = []
      response.data.reportList.forEach(
        element => {
          const e = element;
          if (e.contractType !== "总体") {
            e.showName = e.contractType;
            response.pocSumData.push(e);
          }
        }
      );
      yield put({
        type: 'savePocSum',
        payload: response.pocSumData,
      });
    },

    * getPocAdd(payload, {
      call,
      put
    }) {
      const response = yield call(getPocAdd, payload);
      response.pocAddData = []
      response.data.reportList.forEach(
        element => {
          const e = element;
          if (e.contractType !== "总体") {
            e.showName = e.contractType;
            response.pocAddData.push(e);
          }
        }
      );
      yield put({
        type: 'savePocAdd',
        payload: response.pocAddData,
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
    savePOCSum(state, action) {
      return {
        ...state,
        POCProductSum: action.payload,
      };
    },
    saveContractSum(state, action) {
      return {
        ...state,
        contractSum: action.payload,
      };
    },

    savePocSum(state, action) {
      return {
        ...state,
        pocSum: action.payload,
      };
    },
    savePocAdd(state, action) {
      return {
        ...state,
        pocAdd: action.payload,
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
