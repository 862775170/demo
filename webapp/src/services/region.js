
import request from '@/utils/request';

const baseurl = '/server/api';

// 区域管理 列表接口
export async function getRegionList() {
  return request(`${baseurl}/product/region/list`);
}

// 不用
export default async function putAudit() {
  return request(`${baseurl}/product/region/list`);
}
