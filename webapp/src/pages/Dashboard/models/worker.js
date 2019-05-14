import { 
    getTaskList, 
    getTaskListByUntreated, 
    putTaskSingle,
    getInvolvedTaskCount,
    putAudit, 
    getTaskCount,
    getTaskUntreatedCount,
    getMeTaskCount,
    getMeTaskList,
    getInvolvedTaskLists,
} from '@/services/worker';

export default {
    namespace: 'worker',

    state: {
        data: [],
        dataTask: [],
    },

    effects: {

        // 待办任务 总
        *taskCount({ payload, callback }, { call }) {
            const response = yield call(getTaskCount, payload);
            if (callback) callback(response);
        },
        // 待签收任务 总
        *taskUntreatedCount({ payload, callback }, { call }) {
            const response = yield call(getTaskUntreatedCount, payload)
            if (callback) callback(response);
        },
        // 我的任务 总
        *meTaskCount({ payload, callback }, { call }) {
            const response = yield call(getMeTaskCount, payload)
            if (callback) callback(response);
        },
        // 相关任务 总
        *involvedTaskCount({ payload, callback }, { call }) {
            const response = yield call(getInvolvedTaskCount, payload)
            if (callback) callback(response);
        },
        

        // 待办任务列表
        *getTaskList(payload, { put, call }) {
            const resp = yield call(getTaskList);
            yield put({
                type: "redTaskList",
                payload: resp.data
            })
        },
        // 待办任务 -> 审批按钮接口
        *audit({ payload, callback }, { call }) {
            const response = yield call(putAudit, payload);
            if (callback) callback(response);
        },

        // 待签收任务列表
        *getTaskListByUntreated(payload, { put, call }) {
            const resp = yield call(getTaskListByUntreated);
            yield put({
                type: "redTaskListByUntreated",
                payload: resp.data
            })
        },
        // 待签收任务 -> 签收按钮接口
        *taskSingle({ payload, callback }, { call }) {
            const response = yield call(putTaskSingle, payload)
            if (callback) callback(response);
        },

        // 我的任务
        *meTaskList({ payload, callback }, { call }) {
            const response = yield call(getMeTaskList, payload)
            if (callback) callback(response);
        },

        // 相关任务
        *involvedTaskLists({ payload, callback }, { call }) {
            const response = yield call(getInvolvedTaskLists, payload)
            if (callback) callback(response);
        },

    },

    reducers: {
        // 待办任务
        redTaskList(state, action) {
            return {
            ...state,
            data: action.payload,
            };
        },

         // 待签收任务
        redTaskListByUntreated(state, action) {
            return {
                ...state,
                dataTask: action.payload,
            };
        }
    },
};