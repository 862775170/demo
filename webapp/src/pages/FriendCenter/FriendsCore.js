import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Layout, 
  Menu, 
  Breadcrumb, 
  Icon, 
  Tabs, 
  Table,
  Form,  
  Divider,
  Alert,
  Button,
  Row,
  Col,
  Input,
  Tree,
  Drawer,
  Modal,
  Card,
} from 'antd';
import moment from 'moment';
import {getUserId, getUserInfo, getRootIds} from '@/utils/authority';
import styles from './style.less';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TreeNode } = Tree;

// 已发送 
const columns2 = [
  {
    title: '规则名',
    dataIndex: 'ruleName',
  },
  {
    title: '源文件名',
    dataIndex: 'sourceFileName',
  },
  {
    title: '保存文件名',
    dataIndex: 'targerFileName',
  },
  {
    title: '发送时间',
    dataIndex: 'time',
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>, 
  },
];

// 已收取
const columns3 = [
  {
    title: '规则名',
    dataIndex: 'ruleName',
  },
  {
    title: '源文件名',
    dataIndex: 'sourceFileName',
  },
  {
    title: '保存文件名',
    dataIndex: 'targerFileName',
  },
  {
    title: '接收时间',
    dataIndex: 'time',
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>, 
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
    done: false,
    treeData: [                // 发送规则  新建和修改共用  源路径
      { filename_KeywordIkPinyin:'/' ,file_id:getRootIds() }
    ],
    userId: getUserId(),       // 获取登录用户的用户ID
    friendsId: '',             // 好友列表用户ID
    friendsName: '',           // 好友列表用户名
    friendsArr: [],          // 存储好友列表数据
    operationkey: 'tab1',    // 用于存储切换的是哪个tab
    isTips: true,           // 左边栏没数据提示
    subEdit: true,           // 用于控制新建按钮

    receiveCurrent: {},      // 接收规则 存储某行对象参数
    acceptanceRule: false,   // 接收规则 模态框属性

    drawerParameter: {},      // 新建规则    
    isRoute: false,            // 用于判断调用新建还是修改
    visibles: false,           // 发送规则  抽屉属性
    fileId: '',
    path: '',
    userInfo: getUserInfo(),
  };

  // 初始化方法
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
        // 存储 好友列表用户ID
        if(result.data.length > 0){
          const userIds = result.data[0].userId;
          const {userName} = result.data[0];
          this.setState({
            friendsId: userIds,
            friendsName: userName,
            isTips: true,
          });
          this.state.friendsArr = result.data;   // 存储好友列表数据
          this.coreRuleRelation(userId, userIds);      // 好友中心 规则
        }else{
          this.setState({
            isTips: false,
          });
        }
      } 
    });
  }

  // 点击 好友列中某个好友  查询  对应的  列表数据
  userList = item => {
    // 存储 好友列表用户ID
    const userId = item.key;
    const {value} = item.item.props;
    this.setState({
      friendsId: userId,
      friendsName: value,
    });
    const { operationkey } = this.state;  // 获取tab切换状态
    this.tabs(operationkey, userId);      // 不同的用户和tab联动却换
  }

  // 点击tab切换 成不同的  列表数据
  clickTabs = key => {
    // 存储 tab却换状态
    this.setState({
      operationkey: key,
    });
    const { friendsId } = this.state;   // 获取用户列表  用户id
    this.tabs(key, friendsId);          // 不同的用户和tab联动却换
  };

  // 不同的用户和tab联动却换
  tabs = (key, id) => {
    const { userId } = this.state;           // 获取登录用户的用户ID
    this.setState({
      subEdit: false,
    });
    switch(key){
      case "tab1": 
        this.coreRuleRelation(userId, id);              // 发送规则列表
        this.setState({
          subEdit: true,
        });
        break;
      case "tab2": 
        this.coreRuleReceive(userId, id);              // 接收规则列表
        break;
      case "tab3": 
        this.coreSender(id, userId);         // 已发送列表
        break;
      case "tab4": 
        this.coreReceiver(id, userId);       // 已收取列表
        break;
      default : 
        
        break;
    }
  }

  // 发送规则
  coreRuleRelation = (userid, id) => {
    const { dispatch } = this.props;
    const userId = userid;
    const targetUserId = id;
    dispatch({
      type: 'friend/getRuleRelation',
      payload: { userId, targetUserId },
    });
  }

  // 接收规则
  coreRuleReceive = (userid, id) => {
    const { dispatch } = this.props;
    const userId = userid;
    const targetUserId = id;
    dispatch({
      type: 'friend/getRuleReceive',
      payload: { userId, targetUserId },
    });
  }

  // 已发送
  coreSender = (id, userId) => {
    const { dispatch } = this.props;
    const sourceUserId = id;
    const targetUserId = userId;
    dispatch({
      type: 'friend/getSender',
      payload: { sourceUserId, targetUserId },
    });
  }

  //  已收取
  coreReceiver = (id, userId) => {
    const { dispatch } = this.props;
    const sourceUserId = id;
    const targetUserId = userId;
    dispatch({
      type: 'friend/getReceiver',
      payload: { sourceUserId, targetUserId },
    });
  }

   // 新建规则 抽屉 点击保存按钮
   handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { isRoute } = this.state;
    form.validateFields((err, fieldsValue) => { 
      if (err) return;
      if(isRoute){     // true 为新建规则
        this.urleGetSubmitRule(fieldsValue);   // 新建规则提交方法
      }else{           // false 为发送规则-->修改
        this.coreRuleUpdate(fieldsValue);  // 发送规则  修改 
      }
      this.onClose();   // 关闭抽屉
    });
  };

  // 新建规则  提交方法
  urleGetSubmitRule = fields => {
    const { dispatch } =  this.props;
    const { userInfo, friendsId, userId } = this.state;
    const user = userInfo;
    const createBy = getUserId()
    const rootIds = user.root_ids;
    const path = this.state;
    const fileid = this.state
    const sourceFileId = fileid.fileId;
    const sourcePath = path.path;
    const userIds = friendsId
    dispatch({
      type: 'friend/getSubmitRule',
      payload:{ ...fields, createBy, rootIds, sourcePath, sourceFileId, userIds },
      callback: () => {
        this.coreRuleReceive(userId, friendsId);              // 接收规则列表
      } 
    });
  }

  // 发送规则 修改  提交方法
  coreRuleUpdate = fields => {
    const { dispatch } = this.props;
    const { userInfo, path, drawerParameter, userId, friendsId } = this.state;
    // eslint-disable-next-line no-unused-vars
    const user = userInfo;
    const createBy = getUserId();
    const {ruleId} = drawerParameter;
    const sourcePath = path;
    const fileid = this.state
    const sourceFileId = fileid.fileId;
    const userIds = friendsId;
    dispatch({
      type: 'friend/getRuleUpdate',
      payload:{ ...fields, createBy, sourcePath, ruleId, sourceFileId, userIds },
      callback: () => {
        this.coreRuleReceive(userId, friendsId);              // 接收规则列表
      } 
    });
  }

  // 新建规则  点击新建按钮点击此方法   抽屉  源路径实现方法  start
  showDrawer = () => {
    this.setState({
      isRoute: true,            // 发送规则  用于判断调用新建还是修改
      visibles: true,           // 发送规则抽屉属性
      drawerParameter: {},      // 发送规则  存储某行对象参数
    });
  };

  // 发送规则 修改  调出抽屉  
  showUpdateDrawer = item => {
    this.setState({
      isRoute: false,            // 发送规则  false调用修改
      visibles: true,            // 发送规则抽屉属性
      drawerParameter: item,     // 发送规则  存储某行对象参数
    });
  };

  // 新建规则 抽屉取消
  onClose = () => {
    this.setState({
      visibles: false,    // false 关系抽屉
    });
  };

  // 新建和修改共用  源路径
  onLoadData = treeNode => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
    if (treeNode.props.children) {
      resolve();
      return;
    }
    const { file_id:fileId } = treeNode.props.dataRef;
    dispatch({
      type: 'friend/getFileList',
      payload:{ fileId },
      callback: (result) => {
        const fileArr = [];
        const dataValue = result.result;
        // eslint-disable-next-line no-restricted-syntax
        for( const i of dataValue){
          if(i.isdir === true){
            fileArr.push(i);
          }
        }
        // eslint-disable-next-line no-param-reassign
        treeNode.props.dataRef.children = fileArr;
        const { treeData } = this.state;
        this.setState({
          treeData,
        });
        resolve();
      } 
    });
  })
};

// 新建和修改共用  源路径
getOnSelect = (selectedKeys, e) => {
  if(e.selectedNodes.length > 0){
    const titleValue = e.selectedNodes[0].props.title;
    let paths = "";
    let fileid ="";
    if(titleValue === '/'){
      paths = e.selectedNodes[0].props.dataRef.filename_KeywordIkPinyin;
      fileid = e.selectedNodes[0].props.dataRef.file_id;
    }else{
      paths = e.selectedNodes[0].props.dataRef.fullpath;
      fileid = e.selectedNodes[0].props.dataRef.file_id;
    }
    this.setState({
      path: paths,  // 源路径
      fileId: fileid,
    });      
  }
}

// 新建和修改共用  源路径
renderTreeNodes = data => data.map(item => {
  if (item.children) {
    return (
      <TreeNode title={item.filename_KeywordIkPinyin} key={item.file_id} dataRef={item}>
        {this.renderTreeNodes(item.children)}
      </TreeNode>
    );
  }
  return <TreeNode title={item.filename_KeywordIkPinyin} key={item.file_id} dataRef={item} />;
});

// 接收规则 修改  点击修改弹出模态框
showReceiveModal = item => {
  this.setState({
    acceptanceRule: true,
    receiveCurrent: item,
  });
}

// 接收规则 修改
ruleModalOk = () => {
  const { dispatch } =  this.props;
  const { path, receiveCurrent, userId, friendsId } = this.state;
  const {id} = receiveCurrent;
  const {rootIds} = receiveCurrent;
  const savePath = path;
  dispatch({
    type: 'friend/getRuleConfirmUpdate',
    payload:{ savePath, id, rootIds },
    callback: () => {
      this.coreRuleReceive(userId, friendsId);              // 接收规则列表
      this.ruleModalCancel(); // 接收规则  修改规则  取消模态框
    } 
  });
}

// 接收规则  修改规则  取消模态框
ruleModalCancel = () => {
  this.setState({
    acceptanceRule: false,
  });
};

  
  
  

  render() {
    const { loading, 
      form: {getFieldDecorator}, 
      friend: { ruleList },   // 规则列表返回数据
    } = this.props;

    const { 
      operationkey, 
      friendsArr, 
      friendsName, 
      isTips, 
      drawerParameter, 
      isRoute, 
      treeData, 
      visibles, 
      subEdit, 
      done,
      receiveCurrent, 
      acceptanceRule, 
    } = this.state;

    // 发送规则   新建
    const getAddForm = () => {
      return (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label="规则名">
                {getFieldDecorator('ruleName', {
                  rules: [{ required: true, message: '请输入规则名! ' }],
                  initialValue: drawerParameter.ruleName,
                })(<Input placeholder="请输入规则名" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label="源路径">
                <Tree loadData={this.onLoadData} onSelect={this.getOnSelect}>{this.renderTreeNodes(treeData)}</Tree>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} style={{ display: isRoute ? 'block' : 'none'}}>
            <Col span={16}>
              <FormItem label="接收方">
                {getFieldDecorator('userIds', {
                  rules: [{ required: false }],
                  initialValue: friendsName,
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label="备注">
                {getFieldDecorator('desc', {
                  rules: [{ required: false}],
                  initialValue: drawerParameter.desc,
                })(<Input placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    };

    // table组件属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };

    // 发送规则
    const columns = [
      {
        title: '规则名',
        dataIndex: 'ruleName',
      },

      {
        title: '文件数',
        dataIndex: 'count',
        render: val => `${val} 个`,
      },
      {
        title: '备注',
        dataIndex: 'desc',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showUpdateDrawer(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.showSaveRuleModal(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    // 接收规则
    const columns5 = [
      {
        title: '规则名',
        dataIndex: 'ruleName',
      },
      {
        title: '保存目录',
        dataIndex: 'savePathName',
      },
      {
        title: '文件数',
        dataIndex: 'count',
        render: val => `${val} 个`,
      },
      {
        title: '生效时间',
        dataIndex: 'confirmTime',
        render: val => val?<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>:'未生效', 
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showReceiveModal(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.showSaveRuleModal(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

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
          columns={columns5}
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
      tab4: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={ruleList}
          columns={columns3}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
    };

    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };

    return (
      <Layout style={{width: '100%',height:'91%',position: 'absolute',marginTop: '0px'}}>
        <Sider width={200}>
          <Menu
            mode="inline"
            // defaultSelectedKeys={friendsName}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            {
              isTips ?
                friendsArr.map((item) => { 
                  return <Menu.Item key={item.userId} value={item.userName} onClick={this.userList} style={{marginTop: '0px'}}><Icon type="user" />{item.userName}</Menu.Item>
                }) : <Alert message="暂无数据" type="info" style={{padding:'10px'}} />
            }
          </Menu>
        </Sider>
        
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>好友中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ friendsName }</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{margin: '10px 0px'}} />
          <div style={{display: subEdit ? 'block' : 'none',}}>
            <Button icon="plus" type="primary" onClick={this.showDrawer}>新建</Button>
          </div>
          <Tabs defaultActiveKey="tab1" onChange={this.clickTabs} size="default" style={{marginTop: '5px'}}>
            <TabPane tab="发送规则" key="tab1">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="接收规则" key="tab2">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="已发送" key="tab3">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="已收取" key="tab4">
              {contentList[operationkey]}
            </TabPane>
          </Tabs>
        </Content>

        {/* 抽屉  新建规则 */}
        <Drawer
          title={isRoute ? '新建规则' : '修改规则'}
          width={600}
          onClose={this.onClose}
          visible={visibles}
          destroyOnClose
        >
          { getAddForm() }
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>取消</Button>
            <Button onClick={this.handleSubmit} type="primary">确定</Button>
          </div>
        </Drawer>

        {/* 接收规则（修改） */}
        <Modal
          title='接收规则详情'
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={acceptanceRule}
          onOk={this.ruleModalOk}
          onCancel={this.ruleModalCancel}
        >
          <Card bordered={false} style={{ marginBottom:'20px' }}>
            <Form layout="horizontal">
              <Form.Item {...formItemLayout} className={styles.stepFormText} label="发送方">
                {friendsName}
              </Form.Item>
              <Form.Item {...formItemLayout} className={styles.stepFormText} label="规则描述">
                {receiveCurrent.ruleName}
              </Form.Item>
              <Divider style={{ margin: '24px 0' }} />
              <Form.Item {...formItemLayout} label="选择路径" required={false}>
                <Tree loadData={this.onLoadData} onSelect={this.getOnSelect}>{this.renderTreeNodes(treeData)}</Tree>
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      </Layout>
    );
  }
}

export default FriendsCore;
