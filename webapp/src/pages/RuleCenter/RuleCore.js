import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Layout, Menu,Alert,Card, Checkbox, Breadcrumb, Icon, Table, Form, Divider, Modal, Button, Select, Input, Drawer, Row, Col, Tree } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import moment from 'moment';
import { log } from 'util';

const { TreeNode } = Tree;
const { Description } = DescriptionList;
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { SubMenu } = Menu;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

@connect(({ core, loading }) => ({
  core,
  loading: loading.models.core,
}))
// 规则中心
@Form.create()
class RuleCore extends PureComponent {

  state = {
    done: false,
    crumbs: '待确认规则',
    saveRuleVisible: false,    //待确定规则模态框属性
    saveRuleoBject: {},        //待确定规则 保存规则存储对象

    isRoute: false,            //发送规则  用于判断调用新建还是修改
    visibles: false,           //发送规则  抽屉属性
    visibleList: false,        //发送规则 接收人员列表   模态框属性
    drawerParameter: {},       //发送规则  存储某行对象参数
    treeData: [                //发送规则  新建和修改共用  源路径
      { filename_KeywordIkPinyin:'/' ,file_id:sessionStorage.getItem('rootIds') }
    ], 
    fileArr: [],               //发送规则  新建和修改共用  源路径 数组存储获取的路径
    allGroupUser: [],          //发送规则  新建规则  存储接收方数组值
    ruleDetailsList: [],        //发送规则  接收人员列表
    indeterminate: true,        //发送规则  接收人员列表  单个选择
    checkAll: false,            //发送规则  接收人员列表  单个选择
    checkedList: [],            //发送规则  接收人员列表  单个选择

    acceptanceRule: false,   //接收规则 模态框属性
    receiveCurrent: {},      //接收规则 存储某行对象参数

    //公用
    userId: sessionStorage.getItem('userid'),
    userInfo: sessionStorage.getItem("userInfo"),
    path: '',
    subEdit: false,
    operationkey: 'tab1',
    
  };
  // 创建用户lable 和 input 布局
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  // 初始化方法
  componentDidMount() {
    this.coreRuleTasks();       // 待确认规则 列表
  }

  // 左边栏切换
  leftSidebarToggle = (item) => {
    this.setState({
      operationkey: item.key,
      crumbs: item.item.props.title,
      subEdit: false,
    })
    // 待确认规则
    if(item.key === "tab1"){
      this.coreRuleTasks();
    }
    // 发送规则
    if(item.key === "tab2"){
      this.setState({
        subEdit: true,
      })
      this.coreRuleMyRule();  // 我的规则   发送规则
    }
    // 确认规则
    if(item.key === "tab3"){
      this.coreConfirmRule();// 我的规则   接收规则
    }
  }

  // 待确认规则 全部列表
  coreRuleTasks = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'core/getRuleTasks',
      payload:{ userId },
    });
  }
  //待确定规则  保存规则  确定模态框  saveRuleoBject
  saveRuleModalOk = () => {
    const { dispatch } =  this.props;
    const { path, saveRuleoBject, userInfo } = this.state;  //获取所有用户 userInfo
    const user = JSON.parse(userInfo);
    const rootIds = user.root_ids;
    const taskId = saveRuleoBject.id;
    const savePath = path;
    dispatch({
      type: 'core/getRuleConfirmRule',
      payload:{ savePath, rootIds, taskId },
      callback: () => {
        this.saveRuleModalCancel();  //待确定规则  保存规则  取消模态框
        this.coreRuleTasks();        // 待确认规则 全部列表
      } 
    });
  }
  // 待确定规则 弹出  保存规则  模态框
  showSaveRuleModal = item => {
    this.setState({
      saveRuleVisible: true,    //待确定规则模态框属性
      saveRuleoBject: item,     //获取列表某一行参数值
    });
  }
  //待确定规则  保存规则  取消模态框
  saveRuleModalCancel = () => {
    this.setState({
      saveRuleVisible: false,
    });
  };

  



//---------------------------------------------------发送规则
  // 发送规则  列表
  coreRuleMyRule = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'core/getRuleMyRule',
      payload:{ userId },
    });
  }

  // 发送规则  新建规则  点击新建按钮点击此方法   抽屉  源路径实现方法  start
  showDrawer = () => {
    this.setState({
      isRoute: true,            //发送规则  用于判断调用新建还是修改
      visibles: true,           //发送规则抽屉属性
      drawerParameter: {},      //发送规则  存储某行对象参数
    });
    this.ruleGetUserGetRootGroup();     // 接收方
  };

  //发送规则 新建规则 抽屉 点击保存按钮
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { isRoute } = this.state;
    form.validateFields((err, fieldsValue) => { 
      if (err) return;
      if(isRoute){     //true 为新建规则
        this.urleGetSubmitRule(fieldsValue);   //新建规则提交方法
      }else{           //false 为发送规则-->修改
        this.coreRuleUpdate(fieldsValue);  //发送规则  修改 
      }
      this.onClose();   //关闭抽屉
    });
  };

  // 发送规则 新建规则  提交方法
  urleGetSubmitRule = fields => {
    const { dispatch } =  this.props;
    const { userInfo } = this.state;
    const user = JSON.parse(userInfo);
    const createBy = user.nick_name;
    const rootIds = user.root_ids;
    const path = this.state;
    const sourcePath = path.path;
    dispatch({
      type: 'core/getSubmitRule',
      payload:{ ...fields, createBy, rootIds, sourcePath },
      callback: () => {
        this.coreRuleMyRule();    // 我的规则   发送规则
      } 
    });
  }

  // 发送规则 新建规则 抽屉取消
  onClose = () => {
    this.setState({
      visibles: false,    // false 关系抽屉
    });
  };

  // 发送规则 新建规则   接收方  目录结构
  ruleGetUserGetRootGroup = () => {
    const { dispatch } =  this.props;
    dispatch({
      type: 'core/getUserGetRootGroup',
      callback: (result) => {
        const ids = result.result.id;
        this.urleGetUserlistAllGroupUser(ids);  // 接收方 
      } 
    });
  }
  // 发送规则 新建规则  接收方 
  urleGetUserlistAllGroupUser = item => {
    const { dispatch } =  this.props;
    const groupId = item;
    const page = 1;
    const pageSize = 99999;
    dispatch({
      type: 'core/getUserlistAllGroupUser',
      payload:{ groupId, page, pageSize },
      callback: (result) => {
        this.state.allGroupUser = result.result;
      } 
    });
  }


  // 发送规则 修改  调出抽屉  
  showUpdateDrawer = item => {
    this.setState({
      isRoute: false,            //发送规则  false调用修改
      visibles: true,            //发送规则抽屉属性
      drawerParameter: item,     //发送规则  存储某行对象参数
    });
    this.ruleGetUserGetRootGroup();     // 接收方
  };

  // 发送规则 修改  提交方法
  coreRuleUpdate = fields => {
    const { dispatch } = this.props;
    const { userInfo, path, drawerParameter } = this.state;
    const user = JSON.parse(userInfo);
    const createBy = user.nick_name;
    const ruleId = drawerParameter.ruleId;
    const sourcePath = path;
    dispatch({
      type: 'core/getRuleUpdate',
      payload:{ ...fields, createBy, sourcePath, ruleId },
      callback: () => {
        this.coreRuleMyRule();    // 我的规则   发送规则
      } 
    });
  }

  //发送规则  新建和修改共用  源路径
  ruleGetFileList = () => {
    const { dispatch } = this.props;
    const fileId = sessionStorage.getItem('rootIds');
    dispatch({
      type: 'core/getFileList',
      payload:{ fileId },
      callback: (result) => {
        this.state.fileArr = result.result;
        this.setState({treeData:result.result});
      } 
    });
  }
  //发送规则  新建和修改共用  源路径
  onLoadData = treeNode => {
      const { dispatch } = this.props;
      return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const { file_id:fileId } = treeNode.props.dataRef;
      dispatch({
        type: 'core/getFileList',
        payload:{ fileId },
        callback: (result) => {
          const fileArr = [];
          const dataValue = result.result;
          for( let i of dataValue){
            if(i.isdir === true){
              fileArr.push(i);
            }
          }
          treeNode.props.dataRef.children = fileArr;
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        } 
      });
    })
  };
  //发送规则  新建和修改共用  源路径
  getOnSelect = (selectedKeys, e) => {
    if(e.selectedNodes.length > 0){
      const titleValue = e.selectedNodes[0].props.title;
      let paths = "";
      if(titleValue === '/'){
        paths = e.selectedNodes[0].props.dataRef.filename_KeywordIkPinyin;
      }else{
        paths = e.selectedNodes[0].props.dataRef.fullpath;
      }
      this.setState({
        path: paths,  //源路径
      });      
    }
  }
  //发送规则  新建和修改共用  源路径
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


  // 发送规则 删除
  coreRuleMyRuleDelete = item => {
    Modal.confirm({
      title: '删除',
      content: `确定删除“${ item.createBy }”吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(item),
    });
  };  
  // 发送规则 删除 点击确定正式删除方法
  deleteItem = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'core/getRuleDelete',
      payload: {
        ...record
      },
      callback: (result) => {
        this.coreRuleMyRule();   //我的规则   发送规则 
      }
    });
  }


  // 发送规则 接收人员列表
  coleGetRileDetails = item => {
    const { dispatch } =  this.props;
    dispatch({
      type: 'core/getRuleDetails',
      payload:{ item },
      callback: (rel) => {
        this.state.ruleDetailsList = rel.data;
      } 
    });
    this.setState({
      visibleList: true,
    });
  }

  //发送规则 接收人员列表  单个选择
  onChangEalon = ckList => {
    this.setState({
      checkedList: ckList,
    })
  };

  //发送规则  接收人员列表  删除   
  receiveOk = () => {
    const { dispatch } =  this.props;
    const { userId, checkedList } = this.state;
    dispatch({
      type: 'core/getRuleConfirmDelete',
      payload:{ userId, checkedList },
      callback: () => {
        this.coreRuleMyRule();   //我的规则   发送规则 
        this.receiveCancel();    // 接收人员列表  取消 模态框
      } 
    });
  }

  // 接收人员列表  取消 模态框
  receiveCancel = () => {
    this.setState({
      visibleList: false,
    });
  }




//---------------------------------------------------接收规则
  //接收规则 列表
  coreConfirmRule = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'core/getConfirmRule',
      payload:{ userId },
    });
  }

  //接收规则 修改  点击修改弹出模态框
  showReceiveModal = item => {
    this.setState({
      acceptanceRule: true,
      receiveCurrent: item,
    });
  }

  //接收规则 修改
  ruleModalOk = () => {
    const { dispatch } =  this.props;
    const { taskId, path, receiveCurrent } = this.state;
    const id = receiveCurrent.id;
    const rootIds = receiveCurrent.rootIds;
    const savePath = path;
    dispatch({
      type: 'core/getRuleConfirmUpdate',
      payload:{ savePath, id, rootIds },
      callback: () => {
        this.coreConfirmRule(); // 我的规则   接收规则
        this.ruleModalCancel(); // 接收规则  修改规则  取消模态框
      } 
    });
  }
  
  //接收规则  修改规则  取消模态框
  ruleModalCancel = () => {
    this.setState({
      acceptanceRule: false,
    });
  };



  render() {
    const { loading, form: { getFieldDecorator }, core: { coreData }, core: { myData } } = this.props;
    const { 
      saveRuleVisible, 
      saveRuleoBject,
      done,  
      visibles, 
      visibleList, 
      crumbs, 
      operationkey, 
      subEdit, 
      fileArr, 
      allGroupUser,
      isRoute,
      drawerParameter,
      ruleDetailsList,
      acceptanceRule,
      receiveCurrent,
    } = this.state;
    
    // 待处理规则
    const columns1 = [
      {
        title: '发送方',
        dataIndex: 'createBy',
        render:(text, record, index)=>{
          return <div>{record.createBy}</div>;
        }
      },   
      {
        title: '规则描述',
        dataIndex: 'ruleName',
      },
      {
        title: '源路径',
        dataIndex: 'sourcePathName',
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },  
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showSaveRuleModal(record)}>确认</a>
            <Divider type="vertical" style={{display:'none'}} />
          </Fragment>
        ),
      },
    ]; 
    
    // 发送规则
    const columns2 = [
      {
        title: '规则描述',
        dataIndex: 'ruleName',
      },
      {
        title: '源路径',
        dataIndex: 'sourcePathName',
      },
      {
        title: '生效时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.coleGetRileDetails(record)}>接收人员列表</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showUpdateDrawer(record)}>修改</a>
            <Divider type="vertical"/>
            <a onClick={() => this.coreRuleMyRuleDelete(record)}>删除</a>
          </Fragment>
        ),
      },
    ]; 

    // 接收规则
    const columns3 = [
      {
        title: '规则描述',
        dataIndex: 'ruleName',
      },
      {
        title: '保存路径',
        dataIndex: 'savePathName',
      },
      {
        title: '发送人',
        dataIndex: 'createBy',
      },
      {
        title: '生效时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showReceiveModal(record)}>修改</a>
            <Divider type="vertical" style={{display:'none'}}/>
          </Fragment>
        ),
      },
    ]; 

    // 发送规则   新建
    const getAddForm = () => {
      return (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="规则名">
                {getFieldDecorator('ruleName', {
                  rules: [{ required: visibles, message: '请输入规则名! ' }],
                  initialValue: drawerParameter.ruleName,
                })(<Input placeholder="请输入规则名" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="源路径">
                <Tree loadData={this.onLoadData} onSelect={ this.getOnSelect }>{this.renderTreeNodes(this.state.treeData)}</Tree>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} style={{ display: isRoute ? 'block' : 'none'}}>
            <Col span={12}>
              <FormItem label="接收方">
                {getFieldDecorator('userIds', {
                  rules: [{ required: isRoute, message: '请选择接收方名! ' }],
                })(
                  <Select mode="multiple" placeholder="请选择收方名">
                    {allGroupUser.map(ruleArr => {
                      const {group:{group_name}} =ruleArr
                      return <Option key={ruleArr.id} value={ruleArr.id}>
                      { group_name+"."+ruleArr.nick_name }
                      </Option>
                    })}
                  </Select>
                )}
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
    // 待确定规则  发送规则  接收规则   公用
    const contentList = {
      // 待确定规则
      tab1: (  
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={coreData}
          columns={columns1}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
      // 发送规则
      tab2: (
        <Table
          rowKey="ruleId"
          pagination={false}
          loading={loading}
          dataSource={myData}
          columns={columns2}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
      // 接收规则
      tab3: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={myData}
          columns={columns3}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      )
    };
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    return (
      <Layout style={{width: '100%',height:'92%',position: 'absolute',marginTop: '2px'}}>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['tab1']}
            defaultOpenKeys={['1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            <Menu.Item key="tab1" title="待确认规则" onClick={this.leftSidebarToggle}>
              <Icon type="home" />待确认规则
            </Menu.Item>
            <SubMenu
              key="1"
              title={<span><Icon type="appstore" /><span>我的规则</span></span>}
            >
              <Menu.Item key="tab2" title="发送规则" onClick={this.leftSidebarToggle}>发送规则</Menu.Item>
              <Menu.Item key="tab3" title="接收规则" onClick={this.leftSidebarToggle}>接收规则</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>规则中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{display: subEdit ? 'block' : 'none' }}>
            <Button icon="plus" type="primary" onClick={this.showDrawer}>新建</Button>
          </div>
          <Divider style={{marginTop: '10px'}}/>
          { contentList[operationkey] }
        </Content>

        {/* 待确定规则（确定）*/}
        <Modal
          title='保存规则'
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={saveRuleVisible}
          onOk={this.saveRuleModalOk}
          onCancel={this.saveRuleModalCancel}
        >
          <Card bordered={false} style={{ marginBottom:'20px' }}>
            <p style={{margin: '0 auto'}}>发送方: {saveRuleoBject.createBy}</p>
            <p style={{margin: '0 auto'}}>规则描述: {saveRuleoBject.ruleName}</p>
            <Divider style={{marginTop: '10px'}}/>
            <p style={{margin: '0 auto'}}>选择路径</p>
            <Tree loadData={this.onLoadData} onSelect={ this.getOnSelect }>{this.renderTreeNodes(this.state.treeData)}</Tree>
          </Card>
        </Modal>    

        {/* 发送规则  接收人员列表 */}
        <Modal
          title="接收人员列表"
          width={640}
          bodyStyle={{padding: '10px 72px'}}
          destroyOnClose
          visible={visibleList}
          onOk={this.receiveOk}
          onCancel={this.receiveCancel}
        >
          <Alert message="勾选删除" type="info" showIcon style={{marginBottom: '10px'}}/>
          
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangEalon}>
            <Row>
              {
                ruleDetailsList.map(item => (
                  <Col span={8}>
                    <Checkbox key={item.id} value={item.id}>{ item.userName }</Checkbox>
                  </Col>
                ))
              }
            </Row>
          </Checkbox.Group>
        </Modal>

        {/* 发送规则  新建规则 */}
        <Drawer
          title={isRoute ? '新建规则' : '修改规则'}
          width={720}
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

        {/* 接收规则（修改）*/}
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
            <p style={{margin: '0 auto'}}>发送方: {receiveCurrent.createBy}</p>
            <p style={{margin: '0 auto'}}>规则描述: {receiveCurrent.ruleName}</p>
            <Divider style={{marginTop: '10px'}}/>
            <p style={{margin: '0 auto'}}>选择路径</p>
            <Tree loadData={this.onLoadData} onSelect={ this.getOnSelect }>{this.renderTreeNodes(this.state.treeData)}</Tree>
          </Card>
        </Modal>

      </Layout>
    );
  }
}

export default RuleCore;