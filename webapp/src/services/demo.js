// import { stringify } from 'qs';
import request from '@/utils/request';

function getParams(obj) {
  let result = ''; 
  Object.keys(obj)
    .forEach(key => {
      result = result==='' ? `${result}?${key}=${obj[key]}`:`${result}&${key}=${obj[key]}`;
    });
  return result;
};

export async function getTableData(params) {
  const temp = {...params};
  const response = getParams(temp)
  return request(`/server/api/system/role/lists${response}`);
}

export async function removeItem(params) {
  return request(`/server/api/system/role/del?roleId=${params.roleId}`, {
    method: 'POST',
  });
}

export async function add(params) {
  return request('/server/api/system/role/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(params) {
  return request(`/server/api/system/role/update?roleId=${params.roleId}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}


