import request from '@/utils/request';

const baseurl = '/server/api/system/user'

export async function query() {
  return request('/api/users');
}

// export async function queryCurrent() {
//   return request(`${ baseurl }/info`);
// }

export async function getUserRoles() {
  return request(`${ baseurl  }/info/roles`);
}

export async function switchRole(params) {
  const { roleId } = params;
  return request(`${ baseurl  }/switch/role?roleId=${roleId}`, {
    method: "PUT",
  });
}
// 添加用户
export async function addUser(params) {
  const { body } = params;
  return request(baseurl, {
    method: "POST",
    body
  });
}
// 修改用户
export async function updateUser(params) {
  const { body } = params;
  return request(baseurl, {
    method: "PUT",
    body
  });
}
// //删除用户
// export async function deleteUser(params) {
//   const { userId } = params;
//   return request(baseurl + `?userId=${userId}`, {
//     method: "DELETE"
//   });
// }