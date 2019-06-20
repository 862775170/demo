import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Avatar } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import headportrait from '../../../public/icon-title.png';
import styles from './Home.less';
import {getUserId,getUserInfo} from '@/utils/authority';

const UpdatedTrends = React.lazy(() => import('./UpdatedTrends'));  // 最新动态
const UpdatedFile = React.lazy(() => import('./UpdatedFile'));      // 最新发送文件     最新接收文件

@connect(({ homePage, loading }) => ({
  homePage,
  loading: loading.effects['homePage/getFleCount'],
  getFleCountLoading: loading.effects['homePage/getFleCount'],    // 统计 本日 (发送、接收)  和  历史(发送、接收)  次数
  getNewestSendOutLoading: loading.effects['homePage/getFileSendHis'],  // 最新发送文件
  getNewestSendInLoading: loading.effects['homePage/getNewestSendIn'],    // 最新接收文件
  getTrendsLoading: loading.effects['homePage/getTrends'],                // 最新动态
}))
class Home extends PureComponent {

  state = {
    userName: getUserInfo(),       // 获取登录用户的用户名称
    userId: getUserId(),           // 获取登录用户的用户ID
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

    trendsSize: 5,      // 最新动态初始化展示5条数据
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

  // 最新发送文件     最新接收文件  tab 切换
  onOperationTabChange = key => {
    if(key === "tab1"){
      this.setState({ 
        isKey: true,    //  控制 最新发送文件 翻页组件
      });
      this.homeNewestSendOut();    // 最新发送文件
    }else{
      this.setState({ 
        isKey: false,   //  控制 最新接收文件 翻页组件
      });
      this.homeNewestSendIn();     // 最新接收文件
    }
  };

  // 发送文件
  homeNewestSendOut = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;   // 查询条件参数
    dispatch({
      type: 'homePage/getFileSendHis',
      payload: { userId, page: 1, size: 5 },
      callback: (result) => {
        this.state.sendOutList = result.list;
        this.state.sendOutTotal = result.pagination.total;
      } 
    });
  };

  // 点击翻页 发送文件
  sendOutTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { userId  } = this.state;   // 查询条件参数
    const params = {
      page: pagination,
      size: 5,
    };
    dispatch({
      type: 'homePage/getFileSendHis',
      payload: { userId, ...params },
      callback: (result) => {
        this.state.sendOutList = result.list;
        this.state.sendOutTotal = result.pagination.total;
      } 
    });
  };

  // 接收文件
  homeNewestSendIn = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;   // 查询条件参数
    dispatch({
      type: 'homePage/getRuleMyRuleReceiveCount',
      payload: { userId },
      callback: (result) => {
        this.setState({
          sendList:result.list,
          sendTotals:result.pagination.total
        })
      } 
    });
  };

  // 点击翻页 接收文件
  sendTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { userId  } = this.state;   // 查询条件参数
    
    const params = {
      page: pagination,
      size: 5,
    };
    dispatch({
      type: 'homePage/getRuleMyRuleReceiveCount',
      payload: { userId, ...params },
      callback: (result) => {
        this.setState({
          sendList: result.list,
          sendTotals:result.pagination.total
        })
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
    });
  }

  // 最新动态  点击加载更多
  fetchMore = () => {
    const number = 5;
    const { dispatch } = this.props;
    const { userId, trendsSize } = this.state;   // 查询条件参数
    const size = trendsSize + number;
    this.setState({
      trendsSize: size,
    })
    dispatch({
      type: 'homePage/getTrends',
      payload: { userId, size},
    });
  };

  

  render() {
    const { loading, homePage, getFleCountLoading, getNewestSendOutLoading, getNewestSendInLoading, getTrendsLoading } = this.props;
    const { trendsData } = homePage;
    
    const { 
      name, 
      sizeArray, 
      friendsArr, 
      sendOutList, 
      sendOutTotal, 
      sendList, 
      sendTotals,
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
          <p>
            <Link to="/friendsCore" style={{color:'#000000'}}>
              {friendsArr}
            </Link>
          </p>
        </div>
        <div className={styles.statItem}>
          <p>待确认规则</p>
          <p>
            <Link to="/ruleCore" style={{color:'#000000'}}>
              {sizeArray.unConfirm}
            </Link>
          </p>
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
          <p>发送文件(今日/累计)</p>
          <p>{sizeArray.toDaySend} <span>/ {sizeArray.send}</span></p>
        </div>
        <div className={styles.statItem}>
          <p>接收文件(今日/累计)</p>
          <p>{sizeArray.toDayReceive} <span>/ {sizeArray.receive}</span></p>
        </div>
      </div>
    );

    const operationTabList = [
      {
        key: 'tab1',
        tab: '发送文件',
      },
      {
        key: 'tab2',
        tab: '接收文件',
      },
    ];   

    return (
      <PageHeaderWrapper
        loading={getFleCountLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24} style={{marginTop: '20px'}}>

          {/* 首页--最新发送文件     最新接收文件 */}
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <UpdatedFile
                loading={loading}
                operationTabList={operationTabList}
                isKey={isKey}
                sendOutTotal={sendOutTotal} 
                sendTotals={sendTotals}
                getNewestSendOutLoading={getNewestSendOutLoading}
                getNewestSendInLoading={getNewestSendInLoading}
                sendOutList={sendOutList}
                sendList={sendList}
                onOperationTabChange={this.onOperationTabChange}
                sendOutTableChange={this.sendOutTableChange}
                sendTableChange={this.sendTableChange}
              />
            </Suspense>
          </Col>

          {/* 首页--最新动态 */}
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <UpdatedTrends
                loading={loading}
                getTrendsLoading={getTrendsLoading}
                trendsData={trendsData}
                fetchMore={this.fetchMore}
              />
            </Suspense>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
