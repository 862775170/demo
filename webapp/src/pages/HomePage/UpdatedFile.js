import React, { memo } from 'react';
import { Card, Pagination, Divider, List, Avatar } from 'antd';
import moment from 'moment';
import styles from './Home.less';
import headportrait from '../../../public/icon-title.png';


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
                avatar={<Avatar src={headportrait} style={{marginTop:'8px'}} />}
                title={
                  <span>
                    <a className={styles.username}>文件名：</a>
                    &nbsp;
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
                      上传时间：{moment(item.uploadTime).format('YYYY-MM-DD HH:mm:ss')}
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
                avatar={<Avatar src={headportrait} style={{marginTop:'8px'}} />}
                title={
                  <span>
                    <a className={styles.username}>规则名</a>
                    &nbsp;
                    <span className={styles.event}>{item.ruleName}</span>
                  </span>
                }
                description={
                  <div>
                    <span className={styles.datetime} style={{width: '200px',display: '-webkit-inline-box'}}>
                      累计接收文件数：{item.count}
                    </span>
                    {/* &nbsp;
                    <span className={styles.datetime}>
                      预计/实际发送：{item.fileNumber}/{item.confirmNumber}
                    </span>
                    &nbsp;
                    <span className={styles.datetime} style={{float: 'right'}}>
                      上传时间：{moment(item.uploadTime).format('YYYY-MM-DD HH:mm:ss')}
                    </span> */}
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
