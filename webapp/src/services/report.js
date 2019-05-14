// import { stringify } from 'qs';
import request from '@/utils/request';

export async function getFincloudCust(params) {
  const { id } = params.payload; 
  return request(`/server/api/report/customer/region/sum/${id}`);
}

export async function getFincloudProduct() {
  return request('/server/api/report/customer/product/sum');
}

export async function getCustProductAdd(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/customer/product/add/${ timetype   }/${ productId }`);
}

export async function getCustRegionAdd(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/customer/region/add/${  timetype  }/${  productId}`);
}

export async function getPOCProductSum(params) {
  const { id } = params.payload; 
  return request(`/server/api/report/contract/POC/product/sum/${id}`);
}

export async function getContractSum() {
  return request('/server/api/report/contract/product/sum');
}


export async function getPocSum(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/contract/contract/poc/sum/${ timetype   }/${ productId }`);
}

export async function getPocAdd(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/contract/contract/poc/add/${  timetype  }/${  productId}`);
}

export async function getOrderTotal(params) {
  const { id } = params.payload; 
  return request(`/server/api/report/order/total/${id}`);
}

export async function getOrderAdd(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/order/add/increase/${ productId   }/${ timetype}`);
}

export async function getOrderDel(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/order/del/increase/${ productId   }/${  timetype}`);
}

export async function getCustService(params) {
  const { id } = params.payload; 
  return request(`/server/api/report/customerService/customer/service/${id}`);
}

export async function getServiceProduct() {
  return request('/server/api/report/customerService/service/product');
}

export async function getServiceProductAdd(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/customerService/service/add/product/${ productId   }/${ timetype }`);
}

export async function getServiceRegionAdd(params) {
  const { timetype, productId } = params.payload;
  return request(`/server/api/report/customerService/service/add/region/${  productId  }/${  timetype}`);
}

export async function getResourceUsing() {
  return request('/server/api/report/resource/using');
}

export async function getResourceTerminate() {
  return request('/server/api/report/resource/terminate');
}