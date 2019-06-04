import request from '@/utils/request';

const baseurl = '/server/api'

// 统计 本日 (发送、接收)  和  历史(发送、接收)  次数
export async function fileCount(params) {
  const { userId } = params;
  return request(`${baseurl}/file/exchage/getFileCount?userId=${userId}`);
}

// 好友人数
export async function ruleFriends(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/getFriends?userId=${userId}`);
}

// 待确认规则 个数
export async function ruleTasks(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/tasks?userId=${userId}`);
}


