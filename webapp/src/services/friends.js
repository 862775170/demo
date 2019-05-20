import request from '@/utils/request';

const baseurl = '/server/api'

//好友中心 好友列
export async function friends(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/getFriends?userId=${userId}`);
}

// ---------
export async function ruleConfirmRule(params) {
  const { savePath, taskId } = params;
  return request(`${baseurl}/rule/confirmRule?savePath=${savePath}&taskId=${taskId}`, {
    method: 'POST',
  });
}

