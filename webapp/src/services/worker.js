import request from '@/utils/request'

const baseurl = '/server/api/processes'

// 待办任务 总
export async function getTaskCount() {
    return request(`${baseurl}/task/count`);
}

// 待签收任务 总
export async function getTaskUntreatedCount() {
    return request(`${baseurl}/task/untreated/count`);
}

// 我的任务 总
export async function getMeTaskCount() {
    return request(`${baseurl}/me/task/count`);
}

// 相关任务 总
export async function getInvolvedTaskCount() {
    return request(`${baseurl}/involved/task/count`);
}

// 待办任务 列表
export async function getTaskList() {
    return request(`${baseurl}/task/lists`);
}

// 待办任务 -> 审批按钮接口
export async function putAudit(params) {
    const { id, approved } = params;
    return request(`${baseurl}/audit?approved=${ approved }&taskId=${ id }`,{
        method: 'PUT',
    });
}

// 待签收任务列表
export async function getTaskListByUntreated() {
    return request(`${baseurl}/task/untreated/lists`);
}

// 待签收任务 -> 签收按钮接口
export async function putTaskSingle(params) {
    const { id } = params;
    return request(`${baseurl}/task/single?taskId=${ id }`,{
        method: 'PUT',
    });
}

// 我的任务列表
export async function getMeTaskList() {
    return request(`${baseurl}/me/task/list`);
}

// 相关任务列表
export async function getInvolvedTaskLists() {
    return request(`${baseurl}/involved/task/lists`);
}