import request from '@/utils/request';

const baseurl = '/server/api'

// 好友中心 好友列
export async function ruleFriends(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/getFriends?userId=${userId}`);
}

// 好友中心 规则
export async function ruleRelation(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/rule/relation?userId=${userId}`);
}

