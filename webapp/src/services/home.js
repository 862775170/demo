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

// 上传文件
export async function fileSendHis(params) {
  const { page, size } = params;
  const json = `page=${page}&size=${size}&sortColumn=uploadTime&direction=desc`;
  return request(`${baseurl}/file/exchage/getFileSendHis?${json}`, {
    method: 'POST',
    body: params,
  });
}

// 接收文件
export async function ruleMyRuleReceiveCount(params) {
  const { userId,page } = params;
  let lpage = 1
  if(page){
    lpage= page
  }
  const json = `targetUserId=${userId}&page=${lpage}&size=5&sortColumn=createTime&direction=desc`;
  return request(`${baseurl}/file/exchage/search?${json}`);
}

// 最新动态
export async function trends(params) {
  const { userId, size } = params;
  return request(`${baseurl}/trends?userId=${userId}&page=0&size=${size}&sortColumn=createTime&direction=desc`);
}
