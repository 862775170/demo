import { getLists } from '@/services/permits'
import { listSearch } from '@/utils/listUtils'



export default {
    namespace: 'permits',

    state: {
        baseTableList: [],
        permitsList: {
            list: []
        }
    },

    effects: {
        *getTableList({ payload }, { call, put }) {
            const resp = yield call(getLists)
            yield put({
                type: 'reducerTableList',
                payload: resp
            })
        },

        *searceTableList({ payload }, { put }) {
            yield put({
                type: 'reducerSearceTableList',
                payload: payload
            })
        },

        *addPremits({ payload }, { call, put }) {

        },

        *updatePremits({ payload }, { call, put }) {

        },

        *deletePremits({ payload }, { call, put }) {

        }
    },

    // 
    reducers: {
        reducerTableList(state, { payload }) {

            state.permitsList.list = payload.data
            return {
                ...state,
                baseTableList: payload.data
            }
        },
        reducerSearceTableList(state, { payload }) {

            const { baseTableList } = state;
            let option = []

            if (baseTableList.length > 0) {
                option = Object.keys(baseTableList[0])
            }

            const arr = listSearch(baseTableList, payload.serace, option)
            console.log(arr);
            state.permitsList.list=arr
            return {
                ...state,
            }
        }
    }
}