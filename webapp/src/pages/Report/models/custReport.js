import {
  getFincloudCust,
  getFincloudProduct,
  getCustRegionAdd,
  getCustProductAdd,
  getPOCProductSum,
  getContractSum,
  getPocSum,
  getPocAdd,
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
        for (const item of response.data.reportList) {
          if (item.companyType === element.name) {
            element[item.companyAbbr] = item.num;
          }
        }
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
      response.pAddFields = response.data.productTypeList.map(item => item.productName);
      response.data.productTypeList.unshift({
        productId: "0",
        productName: "总体"
      });

      response.options = response.data.productTypeList;
      
      const temp = ['总体', '1','22','23','33','44'];
      response.pAddGroupBarData=[]
      response.data.reportList.forEach(
        element => {
          if(element.productId!=="0"){
            element.showName = temp[element.productId];
            response.pAddGroupBarData.push(element);
          }
        }
      );
      yield put({
        type: 'saveCustProductAdd',
        payload: response,
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
        payload: response,
      });
    },

    * getPOCProductSum(payload, {
    call,
    put
  }) {
    const response = yield call(getPOCProductSum, payload);
    response.fields = response.data.contractTypeList.map(item => item.ContractType);
    // response.POCProductSumData = response.data.reportList;
    response.data.productTypeList =response.data.productTypeList.filter(
      item =>  item.product !== "总体"
    );
    response.POCProductSumData = response.data.productTypeList
        .map(item => {
          return {
            name: item.product
          }
        });
      response.POCProductSumData.forEach(element => {
        for (const item of response.data.reportList) {
          if (item.product === element.name) {
            element[item.contractType] = item.count;
          }
        }
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
  
  response.pocSumData=[]
  response.data.reportList.forEach(
    element => {
      if(element.contractType!=="总体"){
        element.showName = element.contractType;
        response.pocSumData.push(element);
      }
    }
  );
  yield put({
    type: 'savePocSum',
    payload: response,
  });
},

* getPocAdd(payload, {
  call,
  put
}) {
  const response = yield call(getPocAdd, payload);
    response.pocAddData=[]
      response.data.reportList.forEach(
        element => {
          if(element.contractType!=="总体"){
            element.showName = element.contractType;
            response.pocAddData.push(element);
          }
        }
      );
  yield put({
    type: 'savePocAdd',
    payload: response,
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
    
  },
};
