import {
  getCustProductAdd,
  getPOCProductSum,
  getContractSum,
  getPocSum,
  getPocAdd,
} from '@/services/report';

export default {
  namespace: 'contract',

  state: {
    loading: false,
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

    
  },

  reducers: {
    saveOptions(state, action) {
      return {
        ...state,
        options: action.payload,
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
