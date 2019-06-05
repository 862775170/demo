// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function getUserId() {
  return localStorage.getItem('userid')
}
export function setUserId(userId) {
  localStorage.setItem('userid', userId);
}

export function setToken(token){
  localStorage.setItem('token', token);
}
export function getToken(){
  return localStorage.getItem('token')
}

export function setAuth(auth){
  localStorage.setItem('auth', auth.join(','));
}
export function getAuth(){
  return localStorage.getItem('auth');
}

export function setUserInfo(userInfo){
  localStorage.setItem('userInfo',JSON.stringify(userInfo));
}
export function getUserInfo(){
  if(localStorage.getItem('userInfo')){
    return JSON.parse(localStorage.getItem('userInfo'));
  }else{
    return {}
  }
}

export function getRootIds(){
  return localStorage.getItem('rootIds');
}
export function setRootIds(rootIds){
  localStorage.setItem('rootIds', rootIds);
}
export function setChageRole(chageRole){
  localStorage.setItem('ChageRole', chageRole);
}
export function getChageRole(){
  localStorage.getItem('ChageRole');
}
        