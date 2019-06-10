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
          style={{padding: '0 40px'}}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={headportrait} shape="square" size="large" />}
                title={<a>接收人</a>}
                description={item.targetUserName}
              />
              <div className={styles.listContent}>
                <div className={styles.listContentItem}>
                  <span>文件名</span>
                  <p>{item.sourceFileName}</p>
                </div>
                <div className={styles.listContentItem}>
                  <span>接收时间</span>
                  <p>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              </div>
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
          style={{padding: '0 40px'}}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={headportrait} shape="square" size="large" />}
                title={<a>发送人</a>}
                description={item.sourceUserName}
              />
              <div className={styles.listContent}>
                <div className={styles.listContentItem}>
                  <span>规则名</span>
                  <p>{item.ruleName}</p>
                </div>
                <div className={styles.listContentItem}>
                  <span>接收时间</span>
                  <p>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              </div>
            </List.Item>
          )}
        />
    }
    {
      isKey ? (
        <div style={{margin: '0px 40px'}}>
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
        <div style={{margin: '0px 40px'}}>
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
