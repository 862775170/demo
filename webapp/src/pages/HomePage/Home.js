import React, { PureComponent } from 'react';
// import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, Avatar, List, Pagination, Divider } from 'antd';
// import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import headportrait from '../../../public/icon-title.png';
import styles from './Home.less';

// const links = [
//   {
//     title: '操作一',
//     href: '',
//   },
//   {
//     title: '操作二',
//     href: '',
//   },
//   {
//     title: '操作三',
//     href: '',
//   },
//   {
//     title: '操作四',
//     href: '',
//   },
//   {
//     title: '操作五',
//     href: '',
//   },
//   {
//     title: '操作六',
//     href: '',
//   },
// ];


// const columns = [
//   {
//     title: '测试1',
//     dataIndex: 'index',
//     key: 'index',
//   },
//   {
//     title: '测试2',
//     dataIndex: 'keyword',
//     key: 'keyword',
//   },
//   {
//     title: '测试3',
//     dataIndex: 'count',
//     key: 'count',
//   },
//   {
//     title: '测试4',
//     dataIndex: 'range',
//     key: 'range',
//   },
// ];

@connect(({ project, activities, loading }) => ({
  // currentUser: user.currentUser,
  project,
  activities,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class Home extends PureComponent {

  state = {
    userName: sessionStorage.getItem('userInfo'),       // 获取登录用户的用户名称
    userId: sessionStorage.getItem('userid'),       // 获取登录用户的用户ID
    sizeArray: {},    // 存储 本日 (发送、接收)  和  历史(发送、接收)  次数
    friendsArr: 0,    // 好友个数
    tasksArr: 0,      // 待确认规则 个数
  };

  componentDidMount() {
    this.fleCountSize();  // 统计本日 (发送、接收)  和  历史(发送、接收)  次数
    this.friendsSize();   // 好友人数
    this.ruleTasksSize(); // 待确认规则 个数
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

  // 待确认规则 个数
  ruleTasksSize = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'homePage/getRuleTasks',
      payload: { userId },
      callback: (result) => {
        if(result.data.length > 0){
          const size = result.data.length;
          this.setState({
            tasksArr: size, 
          });
        }
      } 
    });
  }

  // 最新发送文件
  sendOutTableChange = (pagination) => {
    console.log(pagination);
    
    // const { dispatch } = this.props;
    // const { parameter } = this.state;   // 查询条件参数
    // const params = {
    //   page: pagination.current,
    //   size: pagination.pageSize,
    // };
    // dispatch({
    //   type: 'file/getExchageSendOut',
    //   payload: {
    //     ...this.state,
    //     ...parameter,
    //     ...params,
    //   }
    // });
  };

  // renderActivities() {
  //   const {
  //     activities: { list = [] },
  //   } = this.props;
  //   return list.map(item => {
  //     const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
  //       if (item[key]) {
  //         return (
  //           <a href={item[key].link} key={item[key].name}>
  //             {item[key].name}
  //           </a>
  //         );
  //       }
  //       return key;
  //     });
  //     return (
  //       <List.Item key={item.id}>
  //         <List.Item.Meta
  //           avatar={<Avatar src={item.user.avatar} />}
  //           title={
  //             <span>
  //               <a className={styles.username}>{item.user.name}</a>
  //               &nbsp;
  //               <span className={styles.event}>{events}</span>
  //             </span>
  //           }
  //           description={
  //             <span className={styles.datetime} title={item.updatedAt}>
  //               {moment(item.updatedAt).fromNow()}
  //             </span>
  //           }
  //         />
  //       </List.Item>
  //     );
  //   });
  // }

  render() {
    const { projectLoading, loading } = this.props;
    const { userName, sizeArray, friendsArr, tasksArr } = this.state;
    const user = JSON.parse(userName);
    const name = user.user_name;

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
          <p>好友人数</p>
          <p>{friendsArr}</p>
        </div>
        <div className={styles.statItem}>
          <p>待确认规则</p>
          <p>{tasksArr}</p>
        </div>
        <div className={styles.statItem}>
          <p>发送/接收 规则</p>
          <p>1 <span> / 12</span></p>
        </div>
        <div className={styles.statItem}>
          <p>本日 发送/接收</p>
          <p>{sizeArray.toDaySend} <span> / {sizeArray.toDayReceive}</span></p>
        </div>
        {/* <div className={styles.statItem}>
          <p>历史 发送/接收</p>
          <p>{sizeArray.send} <span> / {sizeArray.receive}</span></p>
        </div> */}
      </div>
    );

    const list = [
      {
        title: '1',
        keyword: '12',
        subDescription: '123',
        range: '1234',
      },
      {
        title: '一',
        keyword: '一二',
        subDescription: '一二三',
        range: '一二三四',
      }
    ]

    const ListContent = () => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Owner</span>
          <p>测试数据</p>
        </div>
        <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>2019-6-7</p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        // loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="最新发送文件"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={false}
                dataSource={list}
                style={{padding: '0 40px'}}
                renderItem={item => (
                  <List.Item actions={[ <a>编辑</a> ]}>
                    <List.Item.Meta
                      avatar={<Avatar src={headportrait} shape="square" size="large" />}
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.subDescription}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
              <div style={{margin: '0px 40px'}}>
                <Divider style={{marginTop: '3px'}} />
              </div>
              <Pagination size="small" onChange={this.sendOutTableChange} total={100} style={{float: 'right',padding: '0px 40px 30px 40px'}} />
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="最新接收文件"
              // loading={activitiesLoading}
            >
              
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={false}
                dataSource={list}
                style={{padding: '0 40px'}}
                renderItem={item => (
                  <List.Item actions={[ <a>编辑</a> ]}>
                    <List.Item.Meta
                      avatar={<Avatar src={headportrait} shape="square" size="large" />}
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.subDescription}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
              <div style={{margin: '0px 40px'}}>
                <Divider style={{marginTop: '3px'}} />
              </div>
              <Pagination size="small" onChange={this.sendOutTableChange} total={100} style={{float: 'right',padding: '0px 40px 30px 40px'}} />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            {/* <Card
              style={{ marginBottom: 24 }}
              title="常用操作"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
               <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} /> 
            
            </Card> */}
            {/* <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="XX 指数"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData} />
              </div>
            </Card> */}
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="最新动态"
              loading={projectLoading}
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
