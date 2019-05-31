import request from '@/utils/request';

const baseurl = '/server/api'

// 已发送
export async function exchageSendOut(params) {
  const sourceUserId = sessionStorage.getItem('userid');       // 获取登录用户的用户ID
  const { 
    ruleId, 
    sourceFileName,
    targetFileName,
    receiver,
    startTime, 
    endTime, 
    page, 
    size 
  } = params;
  const targetUserId = receiver;

  let json = `page=${page}&size=${size}&sourceUserId=${sourceUserId}`;
  if(ruleId){
    json += `&ruleId=${ruleId}`;
  }
  if(sourceFileName){
    json += `&sourceFileName=${sourceFileName}`;
  }
  if(targetFileName){
    json += `&targetFileName=${targetFileName}`;
  }
  if(targetUserId){
    json += `&targetUserId=${targetUserId}`;
  }
  if(startTime){
    json += `&startTime=${startTime}`;
  }
  if(endTime){
    json += `&endTime=${endTime}`;
  }
  return request(`${baseurl}/file/exchage/search?${json}`);
}

// 已收取
export async function exchageSendIn(params) {
  const targetUserId = sessionStorage.getItem('userid');       // 获取登录用户的用户ID
  const { 
    ruleId, 
    receiver,
    sourceFileName, 
    targetFileName, 
    startTime, 
    endTime, 
    page, 
    size 
  } = params;
  const sourceUserId = receiver;

  let json = `page=${page}&size=${size}&targetUserId=${targetUserId}`;
  if(ruleId){
    json += `&ruleId=${ruleId}`;
  }
  if(sourceFileName){
    json += `&sourceFileName=${sourceFileName}`;
  }
  if(targetFileName){
    json += `&targetFileName=${targetFileName}`;
  }
  if(sourceUserId){
    json += `&sourceUserId=${sourceUserId}`;
  }
  if(startTime){
    json += `&startTime=${startTime}`;
  }
  if(endTime){
    json += `&endTime=${endTime}`;
  }
  return request(`${baseurl}/file/exchage/search?${json}`);
}

// 接收人
export async function ruleFriends(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/getFriends?userId=${userId}`);
}

