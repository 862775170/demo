import request from '@/utils/request';

const baseurl = '/server/api'

// 已发送
export async function exchageSendOut(params) {
  const { userId } = params;
  return request(`${baseurl}/file/exchage/send/out?userId=${userId}`);
}

// 已收取
export async function exchageSendIn(params) {
  const { userId } = params;
  return request(`${baseurl}/file/exchage/send/in?userId=${userId}`);
}

