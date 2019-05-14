#/bin/bash

logInfo(){
   CUR_DATE=$(date +"%Y-%m-%d %H:%M:%S")
   if [ $? != 0 ]; then
       echo "[${CUR_DATE}]: $1 failed."
       exit 1
   else
       echo "[${CUR_DATE}]: $1 success."
   fi
}
echo `pwd`
CODE_DIR=code
NGINX_DIR=nginx
PACK_PRO_NAME='01boss-access'
API_PRO_NAME='BOSS'
INSTALL_DIR_NAME='install'
BUILD_DIR=compile/${PACK_PRO_NAME}

if [ -d ${BUILD_DIR} ]; then
    rm -rf ${BUILD_DIR}
fi
mkdir -p ${BUILD_DIR}/${INSTALL_DIR_NAME}
svn update ${CODE_DIR}/${PACK_PRO_NAME}

cp -pr ${CODE_DIR}/${PACK_PRO_NAME}/${API_PRO_NAME}/docker/Dockerfile ${BUILD_DIR}
logInfo "cp project dockerfile to compile target"
cp -pr ${CODE_DIR}/${PACK_PRO_NAME}/${API_PRO_NAME}/* ${BUILD_DIR}/${INSTALL_DIR_NAME}
logInfo "cp project ${CODE_DIR}/${PACK_PRO_NAME} to compile target"
cp -pr ${NGINX_DIR} ${BUILD_DIR}
logInfo "cp nginx to compile target"

cd ${BUILD_DIR}
docker build -t goodrain.me/boss-ui .
logInfo "docker build project"
docker push goodrain.me/boss-ui:v1.0
logInfo "docker push project to registry"
