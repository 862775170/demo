
import request from '@/utils/request';

const baseurl = '/server/api';

// 产品管理 列表接口
export async function getProductList() {
  return request(`${baseurl}/product/productcatalogparent/list`);
}

// 不用
export default async function putAudit() {
  return request(`${baseurl}/product/region/list`);
}
