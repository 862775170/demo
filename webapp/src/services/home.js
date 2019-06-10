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

// 最新发送文件
export async function newestSendOut(params) {
  const {userId, startTime, endTime, page, size } = params;
  const json = `page=${page}&size=${size}&sourceUserId=${userId}&startTime=${startTime}&endTime=${endTime}`;
  return request(`${baseurl}/file/exchage/search?${json}`);
}


// 最新接收文件
export async function newestSendIn(params) {
  const { userId, startTime, endTime, page, size } = params;
  const json = `page=${page}&size=${size}&targetUserId=${userId}&startTime=${startTime}&endTime=${endTime}`;
  return request(`${baseurl}/file/exchage/search?${json}`);
}

// 最新动态
export async function trends(params) {
  const { userId, size } = params;
  return request(`${baseurl}/trends?userId=${userId}&page=0&size=${size}&sortColumn=createTime&direction=desc`);
}
