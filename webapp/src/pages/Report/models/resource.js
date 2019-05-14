import {
  getResourceUsing,
  getResourceTerminate,
} from '@/services/report';

export default {
  namespace: 'resource',

  state: {
    loading: false,
    usingData: [],
    terminateData: [],
  },

  effects: {
    * getResourceUsing(_, {
      call,
      put
    }) {
      const response = yield call(getResourceUsing);
      response.srcData = response.data.map(element => {
        const e = element;
        e.parent.displayName = e.parent.productName;
        e.child.forEach(p => {
          const pp = p;
          pp.displayName = pp.regionName
        });
        if(e.parent && e.child){
          e.parent.children = e.child
        }
        return e.parent;
      });
      yield put({
        type: 'saveResourceUsing',
        payload: response.srcData,
      });
    },

    * getResourceTerminate(_, {
      call,
      put
    }) {
      const response = yield call(getResourceTerminate);
      response.srcData = response.data.map(element => {
        const e = element;
        e.parent.displayName = e.parent.productName;
        e.child.forEach(p => {
          const pp = p;
          pp.displayName = pp.regionName
        });
        if(e.parent && e.child){
          e.parent.children = e.child
        }
        return e.parent;
      });
      yield put({
        type: 'saveResourceTerminate',
        payload: response.srcData,
      });
    },


  },

  reducers: {
    saveResourceUsing(state, action) {
      return {
        ...state,
        usingData: action.payload,
      };
    },
    saveResourceTerminate(state, action) {
      return {
        ...state,
        terminateData: action.payload,
      };
    },

  },
}
