import { stringify } from 'qs';
import request from '@/utils/request';

// 系统管理-菜单管理
export async function getMenuList() {
  return request('/server/api/system/menu/lists');
  // return request(`/server/api/menu/list?size=${stringify(params.pageSize)}&current=${stringify(params.currentPage)}`);
}

// 用户管理 列表接口
export async function getUserList(params) {
  const { roleIds, userName, pageSize, currentPage, order, field } = params;
  let url = `roleIds=${roleIds}&userName=${userName}&size=${pageSize}&current=${currentPage}`;
  if(order === "descend"){
    url += `&descs=${ field }`;
  }
  if(order === "ascend"){
    url += `&ascs=${ field }`;
  }
  return request(`/server/api/system/user/lists?${ url }`);
}

// 用户管理 角色名称接口
export async function getRoleList() {
  return request('/server/api/system/role/lists?size=100&current=1');
}

// 新建用户
export async function postUserAdd(params) {
  return request('/server/api/system/user', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 修改用户
export async function postUserUpdate(params){
  return request('/server/api/system/user/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    }
  });
}

// 点击修改按钮  请求后端分配角色查询
export async function userGetRoles(params){
  const { userId } = params;
  return request(`/server/api/system/user/getRoles?userId=${userId}`);
}

// 重置密码
export async function userResetPwd(params){
  const { userId } = params;
  return request(`/server/api/system/user/resetPwd?userId=${userId}`,{
    method: 'POST',
  });
}

export async function addMenu(params) {
  return request('/server/api/system/menu/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeMenu(params) {
  return request(`/server/api/system/menu/del?menuId=${params.menuId}`, {
    method: 'POST',
  });
}
export async function updateMenu(params) {
  return request(`/server/api/system/menu/update?menuId=${params.menuId}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}


