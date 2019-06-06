import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Avatar, List, Pagination, Divider, Button, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import headportrait from '../../../public/icon-title.png';
import styles from './Home.less';
import {getUserId,getUserInfo} from '@/utils/authority';

@connect(({ homePage, loading, chart }) => ({
  chart,
  homePage,
  loading: loading.models.homePage,
  getFleCountLoading: loading.effects['homePage/getFleCount'],
  getNewestSendOutLoading: loading.effects['homePage/getNewestSendOut'],
  getNewestSendInLoading: loading.effects['homePage/getNewestSendIn'],
  getTrendsLoading: loading.effects['homePage/getTrends'],
}))
class Home extends PureComponent {

  state = {
    userName: getUserInfo(),       // 获取登录用户的用户名称
    userId: getUserId(),           // 获取登录用户的用户ID
    operationkey: 'tab1',
    isKey: true,                   // true 为 最新发送文件  false 为 最新接收文件
    sizeArray: {        // 存储 本日 (发送、接收)  和  历史(发送、接收)  次数      
      "unConfirm": 0,   // 待确认规则
      "rule": 0,        // 发送规则  
      "confirm": 0,     // 接收规则  
      "send": 0,        // 发送文件    
      "receive": 0,     // 接收文件  
    },    
    friendsArr: 0,    // 好友个数
    name: '用户名为空，请先登录！',
    startTime: '',
    endTime: '',

    sendOutList: [],   //  存储最新发送文件 数组
    sendOutTotal: 1,   //  存储最新发送文件 数组总数

    sendList: [],      //  存储最新接收文件 数组
    sendTotals: 1,      //  存储最新接收文件 数组总数

    trendsList:[],      //  动态
    trendsSize: 5,     
  };

  componentDidMount() {
     // 获取当前开始、结束24小时
     const startDate = moment().add({
      hours: -23,
      minutes:-59,
      seconds:-59
    }).toDate().toGMTString();
    const endDate = new Date().toGMTString();
    this.state.startTime = startDate;
    this.state.endTime = endDate;

    const { userName } = this.state;
    this.setState({
      name: userName.nick_name,
    })

    this.fleCountSize();  // 统计本日 (发送、接收)  和  历史(发送、接收)  次数
    this.friendsSize();   // 好友人数
    this.homeNewestSendOut();    // 最新发送文件
    this.homeNewestSendIn();     // 最新接收文件
    this.homeTrends();           // 最新动态

    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });
  }

  // 统计 本日 (发送、接收)  和  历史(发送、接收)  次数
  fleCountSize = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'homePage/getFleCount',
      payload: { userId },
      callback: (result) => {  
        this.setState({
          sizeArray: result.data,   // 存储 本日 (发送、接收)  和  历史(发送、接收)  次数  
        })
      } 
    });
  }

  // 好友人数
  friendsSize = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'homePage/getFriends',
      payload: { userId },
      callback: (result) => {
        if(result.data.length > 0){
          const size = result.data.length;
          this.setState({
            friendsArr: size, 
          });
        }
      } 
    });
  }

  onOperationTabChange = key => {
    if(key === "tab1"){
      this.setState({ 
        operationkey: key,
        isKey: true,    //  控制 最新发送文件 翻页组件
      });
    }else{
      this.setState({ 
        operationkey: key,
        isKey: false,   //  控制 最新接收文件 翻页组件
      });
    }
  };

  // 最新发送文件
  homeNewestSendOut = () => {
    const { dispatch } = this.props;
    const { userId, startTime, endTime  } = this.state;   // 查询条件参数
    dispatch({
      type: 'homePage/getNewestSendOut',
      payload: { userId, startTime, endTime, page: 1, size: 5 },
      callback: (result) => {
        this.state.sendOutList = result.list;
        this.state.sendOutTotal = result.pagination.total;
      } 
    });
  };

  // 点击翻页 最新发送文件
  sendOutTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { userId, startTime, endTime  } = this.state;   // 查询条件参数
    const params = {
      page: pagination,
      size: 5,
    };
    dispatch({
      type: 'homePage/getNewestSendOut',
      payload: { userId, startTime, endTime, ...params },
      callback: (result) => {
        this.state.sendOutList = result.list;
        this.state.sendOutTotal = result.pagination.total;
      } 
    });
  };

  // 最新接收文件
  homeNewestSendIn = () => {
    const { dispatch } = this.props;
    const { userId, startTime, endTime  } = this.state;   // 查询条件参数
    dispatch({
      type: 'homePage/getNewestSendIn',
      payload: { userId, startTime, endTime, page: 1, size: 5 },
      callback: (result) => {
        this.state.sendList = result.list;
        this.state.sendTotals = result.pagination.total;
      } 
    });
  };

  // 点击翻页 最新接收文件
  sendTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { userId, startTime, endTime  } = this.state;   // 查询条件参数
    const params = {
      page: pagination,
      size: 5,
    };
    dispatch({
      type: 'homePage/getNewestSendIn',
      payload: { userId, startTime, endTime, ...params },
      callback: (result) => {
        this.state.sendList = result.list;
        this.state.sendTotals = result.pagination.total;
      } 
    });
  };

  // 最新动态
  homeTrends = () => {
    const { dispatch } = this.props;
    const { userId, trendsSize } = this.state;   // 查询条件参数
    const size = trendsSize;
    dispatch({
      type: 'homePage/getTrends',
      payload: { userId, size},
      callback: (result) => {
        this.state.trendsList = result.lists;
      } 
    });
  }

  // 最新动态  点击加载更多
  fetchMore = () => {
    const number = 5;
    const { dispatch } = this.props;
    const { userId, trendsSize } = this.state;   // 查询条件参数
    const size = trendsSize + number;
    dispatch({
      type: 'homePage/getTrends',
      payload: { userId, size},
      callback: (result) => {
        this.state.trendsList = result.lists;
        this.setState({
          trendsSize: size,
        })
      } 
    });
  };

  

  render() {
    const { 
      loading, 
      getFleCountLoading, 
      getNewestSendOutLoading,
      getNewestSendInLoading,
      getTrendsLoading,
    } = this.props;

    const { 
      name, 
      sizeArray, 
      friendsArr, 
      sendOutList, 
      sendOutTotal, 
      sendList, 
      sendTotals, 
      trendsList,
      operationkey,
      isKey, 
    } = this.state;

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src={headportrait} />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{ name }</div>
          <div>暂无描述</div>
        </div>
      </div>
    )

    // 统计 本日 (发送、接收)  和  历史(发送、接收)  次数
    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>好友</p>
          <p>{friendsArr}</p>
        </div>
        <div className={styles.statItem}>
          <p>待确认规则</p>
          <p>{sizeArray.unConfirm}</p>
        </div>
        <div className={styles.statItem}>
          <p>发送规则</p>
          <p>{sizeArray.rule}</p>
        </div>
        <div className={styles.statItem}>
          <p>接收规则</p>
          <p>{sizeArray.confirm}</p>
        </div>
        <div className={styles.statItem}>
          <p>发送文件</p>
          <p>{sizeArray.send}</p>
        </div>
        <div className={styles.statItem}>
          <p>接收文件</p>
          <p>{sizeArray.receive}</p>
        </div>
      </div>
    );

    // 最新动态  加载更多
    const loadMores =
      trendsList.length > 0 && trendsList.length < 20 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
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
        </div>;

    const operationTabList = [
      {
        key: 'tab1',
        tab: '最新发送文件',
      },
      {
        key: 'tab2',
        tab: '最新接收文件',
      },
    ];   
    
    const contentList = {
      tab1: (
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
      ),
      tab2: (
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
      ),
    };

    return (
      <PageHeaderWrapper
        loading={getFleCountLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24} style={{marginTop: '20px'}}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              onTabChange={this.onOperationTabChange}
            >
              {contentList[operationkey]}
              {
                isKey ? (
                  <div style={{margin: '0px 40px'}}>
                    <Divider style={{marginTop: '3px'}} />
                    <Pagination 
                      size="small" 
                      onChange={this.sendOutTableChange} 
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
                      onChange={this.sendTableChange} 
                      pageSize={5} 
                      total={sendTotals} 
                      style={{float: 'right',padding: '0px 0px 30px 40px'}} 
                    />
                  </div>
              }
            </Card>
          </Col>

          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="最新动态"
              loading={getTrendsLoading}
            >
              <List
                size="large"
                loading={trendsList.length === 0 ? loading : false}
                rowKey="id"
                itemLayout="vertical"
                loadMore={loadMores}
                dataSource={trendsList}
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
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
