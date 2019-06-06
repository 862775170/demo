import request from '@/utils/request';

const baseurl = '/server/api'

// 好友中心 好友列
export async function ruleFriends(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/getFriends?userId=${userId}`);
}

// 好友中心 规则
export async function ruleRelation(params) {
  const { userId, targetUserId } = params;
  return request(`${baseurl}/rule/rule/relation?userId=${userId}&targetUserId=${targetUserId}`);
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

