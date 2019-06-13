import React, { memo } from 'react';
import { Card, Pagination, Divider, List, Avatar } from 'antd';
import moment from 'moment';
import styles from './Home.less';


// 首页--最新发送文件     最新接收文件
const UpdatedFile = memo(({ loading, operationTabList, isKey, sendOutTotal, sendTotals, getNewestSendOutLoading, getNewestSendInLoading, onOperationTabChange, sendOutTableChange, sendTableChange, sendOutList, sendList }) => (
  <Card
    className={styles.tabsCard}
    bordered={false}
    tabList={operationTabList}
    onTabChange={onOperationTabChange}
    loading={loading}
  >
    {
      isKey ? (
        <List
          size="large"
          rowKey="id"
          loading={getNewestSendOutLoading}
          pagination={false}
          dataSource={sendOutList}
          style={{padding: '0 15px'}}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    shape="square" 
                    icon="file" 
                    style={{
                      backgroundColor:'orange',
                      marginTop:'2px',
                      width:'38px',
                      height:'45px',
                      lineHeight: '45px',
                      fontSize: '24px'
                    }} 
                  />
                }
                title={
                  <span>
                    <span className={styles.event}>{item.fileName}</span>
                  </span>
                }
                description={
                  <div>
                    <span className={styles.datetime} style={{width: '200px',display: '-webkit-inline-box'}}>
                      规则名：{item.ruleName}
                    </span>
                    &nbsp;
                    <span className={styles.datetime}>
                      预计/实际发送：{item.fileNumber}/{item.confirmNumber}
                    </span>
                    &nbsp;
                    <span className={styles.datetime} style={{float: 'right'}}>
                      时间：{moment(item.uploadTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : 
        <List
          size="large"
          rowKey="id"
          loading={getNewestSendInLoading}
          pagination={false}
          dataSource={sendList}
          style={{padding: '0 15px'}}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    shape="square" 
                    icon="file" 
                    style={{
                      backgroundColor:'orange',
                      marginTop:'2px',
                      width:'38px',
                      height:'45px',
                      lineHeight: '45px',
                      fontSize: '24px'
                    }} 
                  />
                }
                title={
                  <span>
                    <span className={styles.event}>{item.sourceFileName}</span>
                  </span>
                }
                description={
                  <div>
                    <span className={styles.datetime} style={{width: '200px',display: '-webkit-inline-box'}}>
                      规则名：{item.ruleName}
                    </span>
                    &nbsp;
                    <span className={styles.datetime}>
                      发送人：{item.sourceUserName}
                    </span>
                    &nbsp;
                    <span className={styles.datetime} style={{float: 'right'}}>
                      时间：{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
    }
    {
      isKey ? (
        <div style={{margin: '0px 15px'}}>
          <Divider style={{marginTop: '3px'}} />
          <Pagination 
            size="small" 
            onChange={sendOutTableChange} 
            pageSize={5} 
            total={sendOutTotal} 
            style={{float: 'right',padding: '0px 0px 30px 40px'}} 
          />   
        </div>
      ) : 
        <div style={{margin: '0px 15px'}}>
          <Divider style={{marginTop: '3px'}} />
          <Pagination 
            size="small" 
            onChange={sendTableChange} 
            pageSize={5} 
            total={sendTotals}
            style={{float: 'right',padding: '0px 0px 30px 40px'}} 
          />
        </div>
    }
  </Card>
));

export default UpdatedFile;
