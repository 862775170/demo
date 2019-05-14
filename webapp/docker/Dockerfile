FROM centos:7.4.1708_new

WORKDIR /opt/devOps/boss
ENV INSTALL_PATH=/opt/devOps/boss

RUN mkdir -p $INSTALL_PATH
COPY ./install $INSTALL_PATH
RUN chmod 755 -R $INSTALL_PATH
RUN cd $INSTALL_PATH
RUN npm run build

RUN cp -pr $INSTALL_PATH/docker/nginx.conf ./nginx/conf
RUN cp -pr $INSTALL_PATH/dist/* $INSTALL_PATH/nginx/html/
RUN ln -s $INSTALL_PATH/nginx/sbin /usr/local/sbin

CMD ["nginx"]

