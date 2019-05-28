import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Layout, 
  Menu, 
  Breadcrumb, 
  Icon, 
  Tabs, 
  Table,
  Button, 
  Col, 
  Row, 
  Form,  
  Select,
  DatePicker,
  TimePicker,
  Divider,
} from 'antd';
import moment from 'moment';

const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

// 规则
const columns = [
  {
    title: '发送方',
    dataIndex: 'sendUserName',
  },
  {
    title: '接收方',
    dataIndex: 'size',
  },
  {
    title: '规则描述',
    dataIndex: 'ruleName',
  },
  {
    title: '时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
];
// 已发送 & 已收取
const columns2 = [
  {
    title: '源文件名',
    dataIndex: 'sourceFileName',
  },
  {
    title: '保存文件名',
    dataIndex: 'targerFileName',
  },
  {
    title: '规文件描述',
    dataIndex: 'ruleName',
  },
  {
    title: '发送时间',
    dataIndex: 'time',
  },
];

@connect(({ friend, loading }) => ({
  friend,
  loading: loading.models.friend,
}))
// 好友中心
@Form.create()
class FriendsCore extends PureComponent {

  state = {
    userId: sessionStorage.getItem('userid'),       // 获取登录用户的用户ID
    user_Id: '',             //好友列表用户ID
    user_Name: '',           //好友列表用户名
    friendsArr: [],          // 存储好友列表数据
    operationkey: 'tab1',    // 用于存储切换的是哪个tab
  };

  //初始化方法
  componentDidMount() {
    this.coreFriendsList();       // 好友中心 好友列
  }

  // 好友中心 好友列
  coreFriendsList = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'friend/getFriends',
      payload: { userId },
      callback: (result) => {
        //存储 好友列表用户ID
        const userId = result.data[0].userId;
        const userName = result.data[0].userName;
        this.setState({
          user_Id: userId,
          user_Name: userName,
        });
        this.state.friendsArr = result.data;   // 存储好友列表数据
        this.coreRuleRelation(userId);      // 好友中心 规则
      } 
    });
  }

  //点击 好友列中某个好友  查询  对应的  列表数据
  userList = item => {
    //存储 好友列表用户ID
    const userId = item.key;
    const value = item.item.props.value;
    this.setState({
      user_Id: userId,
      user_Name: value,
    });
    const { operationkey } = this.state;  //获取tab切换状态
    this.tabs(operationkey, userId);      //不同的用户和tab联动却换
  }

  //点击tab切换 成不同的  列表数据
  clickTabs = key => {
    //存储 tab却换状态
    this.setState({
      operationkey: key,
    });
    const { user_Id } = this.state;   //获取用户列表  用户id
    this.tabs(key, user_Id);          //不同的用户和tab联动却换
  };
  //不同的用户和tab联动却换
  tabs = (key, user_Id) => {
    const { userId } = this.state;    // 获取登录用户的用户ID
    switch(key){
      case "tab1": 
        this.coreRuleRelation(user_Id);   //规则列表
        break;
      case "tab2": 
        this.coreSender(user_Id, userId);         //已发送列表
        break;
      case "tab3": 
        this.coreReceiver(user_Id, userId);       //已收取列表
        break;
      default : 
        this.coreRuleRelation(userId);   //搜索列表
        break;
    }
  }

  // 规则列表
  coreRuleRelation = item => {
    const { dispatch } = this.props;
    const userId = item;
    dispatch({
      type: 'friend/getRuleRelation',
      payload: { userId },
    });
  }

  // 已发送
  coreSender = (user_Id, userId) => {
    const { dispatch } = this.props;
    const sourceUserId = user_Id;
    const targetUserId = userId;
    dispatch({
      type: 'friend/getSender',
      payload: { sourceUserId, targetUserId },
    });
  }

  //  已收取
  coreReceiver = (user_Id, userId) => {
    const { dispatch } = this.props;
    const sourceUserId = user_Id;
    const targetUserId = userId;
    dispatch({
      type: 'friend/getReceiver',
      payload: { sourceUserId, targetUserId },
    });
  }
  
  

  render() {
    const { 
      loading, 
      form: { getFieldDecorator }, 
      friend: { ruleList },   // 规则列表返回数据
    } = this.props;
    const { operationkey, friendsArr, user_Name } = this.state;

    // table组件属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };

    const contentList = {
      tab1: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={ruleList}
          columns={columns}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
      tab2: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={ruleList}
          columns={columns2}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
      tab3: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={ruleList}
          columns={columns2}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
    };

    return (
      <Layout style={{width: '100%',height:'90%',position: 'absolute',marginTop: '0px'}}>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['admin']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            {
              friendsArr.map((item) => {
                return <Menu.Item key={item.userId} value={item.userName} onClick={this.userList} style={{marginTop: '0px'}}>
                <Icon type="user" />{item.userName}
              </Menu.Item>
              })
            }
          </Menu>
        </Sider>
        
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>好友中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ user_Name }</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{marginTop: '10px'}}/>
          <Tabs defaultActiveKey="tab1" onChange={this.clickTabs} style={{marginTop: '15px'}}>
            <TabPane tab="规则" key="tab1">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="已发送" key="tab2">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="已收取" key="tab3">
              {contentList[operationkey]}
            </TabPane>
            {/* <TabPane tab="任务" key="tab4">
              任务
            </TabPane> */}
          </Tabs>
        </Content>
      </Layout>
    );
  }
}

export default FriendsCore;
