import request from '@/utils/request';

const baseurl = '/server/api'

// 好友中心 好友列
export async function ruleFriends(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/getFriends?userId=${userId}`);
}

// 好友中心 发送规则
export async function ruleRelation(params) {
  const { userId, targetUserId } = params;
  return request(`${baseurl}/rule/${userId}/${targetUserId}`);
}

// 好友中心 接收规则
export async function ruleReceive(params) {
  const { userId, targetUserId } = params;
  return request(`${baseurl}/rule/receive/${userId}/${targetUserId}`);
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

// 好友中心 已发送
export async function sender(params) {
  const { sourceUserId, targetUserId } = params;
  return request(`${baseurl}/file/exchage?sourceUserId=${targetUserId}&targetUserId=${sourceUserId}`);
}

// 好友中心 已收取
export async function receiver(params) {
  const { sourceUserId, targetUserId } = params;
  return request(`${baseurl}/file/exchage?sourceUserId=${sourceUserId}&targetUserId=${targetUserId}`);
}

