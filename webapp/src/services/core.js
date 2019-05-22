import request from '@/utils/request';

const baseurl = '/server/api'

// 待确认规则 列表
export async function ruleTasks(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/tasks?userId=${userId}`);
}

// 待确认规则  保存
export async function ruleConfirmRule(params) {
  const { savePath, taskId, rootIds } = params;
  return request(`${baseurl}/rule/confirmRule?savePath=${savePath}&taskId=${taskId}&rootIds=${rootIds}`, {
    method: 'POST',
  });
}


// 源路径
export async function fileList(params){
  return request('/api/sw/file/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 接收方 目录结构
export async function userGetRootGroup(){
  return request('/api/sw/user/getRootGroup', {
    method: 'POST',
  });
}

// 接收方
export async function userlistAllGroupUser(params){
  return request('/api/sw/user/listAllGroupUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 新建规则  提交 借口
export async function submitRule(params){
  const { userIds } = params;
  return request(`${baseurl}/rule?userIds=${userIds}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}





// 我的规则 ----   发送规则
export async function ruleMyRule(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/myRule?userId=${userId}`);
}
//发送规则  详情 修改
export async function ruleUpdate(params) {
  return request(`${baseurl}/rule/update`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 接收人员列表  查询
export async function ruleDetails(params) {
  const { ruleId } = params.item;
  return request(`${baseurl}/rule/getRule/details?ruleId=${ruleId}`);
}

// 接收人员列表  勾选人员删除
export async function ruleConfirmDelete(params) {
  const { userId, checkedList } = params;
  return request(`${baseurl}/rule/ruleConfirm/delete?userId=${userId}`, {
    method: 'POST',
    body: checkedList,
  });
}

//发送规则  删除
export async function ruleDelete(params) {
  const { userId, ruleId } = params;
  return request(`${baseurl}/rule/delete?userId=${userId}&ruleId=${ruleId}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 我的规则 ----   接收规则
export async function confirmRule(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/my/confirm/rule?userId=${userId}`);
}

//接收规则 修改
export async function ruleConfirmUpdate(params) {
  return request(`${baseurl}/rule/ruleConfirm/update`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}


// 穿梭框查询数据接口
export async function getPermitsList() {
  return request(`/server/api/system/permits/lists`);
}

// 新建
export async function postRoleAdd(params) {
  return request('/server/api/system/role', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 修改
export async function putRoleAdd(params) {
  return request('/server/api/system/role', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}


