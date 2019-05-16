import request from '@/utils/request';

const baseurl = '/server/api'

// 待确认规则 列表
export async function ruleTasks(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/tasks?userId=${userId}`);
}

// 待确认规则  保存
export async function ruleConfirmRule(params) {
  const { savePath, taskId } = params;
  return request(`${baseurl}/rule/confirmRule?savePath=${savePath}&taskId=${taskId}`, {
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

// 我的规则 ----   确认规则
export async function confirmRule(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/my/confirm/rule?userId=${userId}`);
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


