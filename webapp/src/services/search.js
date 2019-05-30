import request from '@/utils/request';

const baseurl = '/server/api'

// 搜索
export async function fileExchageSearch(params) {
  const { 
    ruleId, 
    sourceFileName, 
    sourceUserId, 
    targetUserId, 
    targetFileName, 
    startTime, 
    endTime, 
    page, 
    size 
  } = params;
  
  let json = `page=${page}&size=${size}`;
  if(ruleId){
    json += `&ruleId=${ruleId}`;
  }
  if(sourceFileName){
    json += `&sourceFileName=${sourceFileName}`;
  }
  if(sourceUserId){
    json += `&sourceUserId=${sourceUserId}`;
  }
  if(targetUserId){
    json += `&targetUserId=${targetUserId}`;
  }
  if(targetFileName){
    json += `&targetFileName=${targetFileName}`;
  }
  if(startTime){
    json += `&startTime=${startTime}`;
  }
  if(endTime){
    json += `&endTime=${endTime}`;
  }
  return request(`${baseurl}/file/exchage/search?${json}`);
}

//---------------------
export async function ruleRelation(params) {
  const { userId } = params;
  return request(`${baseurl}/rule/rule/relation?userId=${userId}`);
}


