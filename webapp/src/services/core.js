import request from '@/utils/request';

const baseurl = '/server/api'

// 待确认规则 列表
export async function ruleTasks() {
  return request(`${baseurl}/rule/tasks`);
}






//我的规则 
export async function ruleMyRule() {
  return request(`${baseurl}/rule/myRule`);
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


