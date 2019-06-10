import React, { memo } from 'react';
import { Card, List, Button, Icon } from 'antd';
import moment from 'moment';
import Link from 'umi/link';
import styles from './Home.less';

// 首页--最新动态
const UpdatedTrends = memo(({ loading, getTrendsLoading, trendsData, fetchMore }) => (
  <Card
    bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
    bordered={false}
    title="最新动态"
    loading={loading}
  >
    <List
      size="large"
      loading={trendsData.length === 0 ? loading : false}
      rowKey="id"
      itemLayout="vertical"
      dataSource={trendsData}
      renderItem={item => (
        <List.Item 
          key={item.id}
          style={{ paddingBottom: '9px', paddingTop: '5px', height: '40px',borderBottom: '1px solid #ffffff' }}
        >
          <List.Item.Meta
            title={
              <Link to="/ruleCore" style={{fontSize:'14px'}}>
                <span className={styles.member}>
                  {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')} 
                </span>
                <span style={{float:'right'}}>{item.event}[{item.desc}]</span>
              </Link>
            }
          />
        </List.Item>
      )}
    />
    {
      trendsData.length > 0 && trendsData.length < 20 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={() => fetchMore()} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {getTrendsLoading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : 
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button style={{ paddingLeft: 48, paddingRight: 48 }} disabled>已加载完</Button>
        </div>
    }
  </Card>
));

export default UpdatedTrends;
