import request from '@/utils/request';
import {getUserId} from '@/utils/authority';

const baseurl = '/server/api'

// 已发送
export async function exchageSendOut(params) {
  const sourceUserId = getUserId();       // 获取登录用户的用户ID
  const { 
    sendout,
    sourceFileName,
    targetFileName,
    receiver,
    startTime, 
    endTime, 
    page, 
    size 
  } = params;
  const targetUserId = receiver;
  const ruleId = sendout

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
  const targetUserId = getUserId();       // 获取登录用户的用户ID
  const { 
    collect, 
    receiver,
    sourceFileName, 
    targetFileName, 
    startTime, 
    endTime, 
    page, 
    size 
  } = params;
  const sourceUserId = receiver;
  const ruleId = collect;

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

// 已发送 规则
export async function ruleMyRule(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/myRule?userId=${userId}`);
}

// 已收取 规则
export async function confirmRule(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/my/confirm/rule?userId=${userId}`);
}

