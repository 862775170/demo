import request from '@/utils/request';

const baseurl = '/server/api/system/role'

// 角色管理 角色列表接口
export async function getRoleList() {
  return request(`${baseurl}/lists?size=1000&current=1`);
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


