import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Card, Avatar, List, Pagination, Divider, Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import headportrait from '../../../public/icon-title.png';
import styles from './Home.less';

const { TabPane } = Tabs;

@connect(({ homePage, loading }) => ({
  homePage,
  loading: loading.models.homePage,
}))
class Home extends PureComponent {

  state = {
    userName: sessionStorage.getItem('userInfo'),       // 获取登录用户的用户名称
    userId: sessionStorage.getItem('userid'),           // 获取登录用户的用户ID
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
    if(userName != null){
      const user = JSON.parse(userName);
      const username = user.user_name;
      this.setState({
        name: username,
      })
    }

    this.fleCountSize();  // 统计本日 (发送、接收)  和  历史(发送、接收)  次数
    this.friendsSize();   // 好友人数
    this.homeNewestSendOut();    // 最新发送文件
    this.homeNewestSendIn();     // 最新接收文件
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

  // 最新发送文件
  homeNewestSendOut = () => {
    const { dispatch } = this.props;
    const { userId, startTime, endTime  } = this.state;   // 查询条件参数
    dispatch({
      type: 'homePage/getNewestSendOut',
      payload: { userId, startTime, endTime, page: 1, size: 10 },
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
      size: 10,
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
      payload: { userId, startTime, endTime, page: 1, size: 10 },
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
      size: 10,
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

  render() {
    const { loading } = this.props;
    const { name, sizeArray, friendsArr, sendOutList, sendOutTotal, sendList, sendTotals } = this.state;

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

    return (
      <PageHeaderWrapper
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              bordered={false}
              bodyStyle={{ padding: 0}}
            >
              <Tabs defaultActiveKey="1" size="large">
                <TabPane tab="最新发送文件" key="1">
                  <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    dataSource={sendOutList}
                    style={{padding: '0 40px'}}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={headportrait} shape="square" size="large" />}
                          title={<a href={item.href}>接收人</a>}
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
                  <div style={{margin: '0px 40px'}}>
                    <Divider style={{marginTop: '3px'}} />
                  </div>
                  <Pagination size="small" onChange={this.sendOutTableChange} total={sendOutTotal} style={{float: 'right',padding: '0px 40px 30px 40px'}} />
                </TabPane>
                <TabPane tab="最新接收文件" style={{ marginBottom: 24 }} key="2">
                  <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    dataSource={sendList}
                    style={{padding: '0 40px'}}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={headportrait} shape="square" size="large" />}
                          title={<p>发送人</p>}
                          description={item.sourceUserName}
                        />
                        <div className={styles.listContent}>
                          <div className={styles.listContentItem}>
                            <span>文件描述</span>
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
                  <div style={{margin: '0px 40px'}}>
                    <Divider style={{marginTop: '3px'}} />
                  </div>
                  <Pagination size="small" onChange={this.sendTableChange} total={sendTotals} style={{float: 'right',padding: '0px 40px 30px 40px'}} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="最新动态"
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {/* {notice.map(item => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small" />
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))} */}
                  <Col span={24} key='0'>
                    <Link to='sfdfd'>
                      <Avatar src={headportrait} size="small" />
                      <span className={styles.member}>12345567899</span>
                    </Link>
                  </Col>
                  <Col span={24} key='1'>
                    <Link to='sfdfd'>
                      <Avatar src={headportrait} size="small" />
                      <span className={styles.member}>12345567899</span>
                    </Link>
                  </Col>
                  
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
