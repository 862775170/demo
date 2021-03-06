import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { 
  Layout, 
  Menu,
  // Alert,
  Card,
  Tag, 
  // Checkbox,
  Breadcrumb, 
  Icon, 
  Table, 
  Form, 
  Divider, 
  Modal, 
  Button, 
  Select, 
  Input, 
  Drawer, 
  Row, 
  Col, 
  Tree 
} from 'antd';
import moment from 'moment';
import {getUserId, getUserInfo, getRootIds} from '@/utils/authority';
import DescriptionList from '@/components/DescriptionList';
import styles from './models/style.less';

const { TreeNode } = Tree;
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { SubMenu } = Menu;
const { Option } = Select;

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
    saveRuleVisible: false,    // 待确定规则模态框属性
    saveRuleoBject: {},        // 待确定规则 保存规则存储对象
    modelValue: 'all',        // 待确定规则 同步规则

    isRoute: false,            // 发送规则  用于判断调用新建还是修改
    visibles: false,           // 发送规则  抽屉属性
    visibleList: false,        // 发送规则 接收人员列表   模态框属性
    drawerParameter: {},       // 发送规则  存储某行对象参数
    treeData: [                // 发送规则  新建和修改共用  源路径
      { filename_KeywordIkPinyin:'/' ,file_id:getRootIds() }
    ], 

    allGroupUser: [],             // 发送规则  新建规则  存储接收方数组值
    ruleDetailsList: [],          // 发送规则  接收人员列表 已确认数组
    ruleUncertaintyList: [],      // 发送规则  接收人员列表 未确认数组
    ruleAddUserNameList: [],      // 发送规则  接收人员列表 添加收方名数组
    ruleAddUserIdList: [],        // 发送规则  接收人员列表 添加收方ID数组
    receiverListRuleId: '',       // 发送规则  接收人员列表 每列ruleId
    receiverName: '',             // 发送规则  接收人员列表 每列规则名

    acceptanceRule: false,   // 接收规则 模态框属性
    receiveCurrent: {},      // 接收规则 存储某行对象参数

    // 公用
    userId: getUserId(),
    userInfo: getUserInfo(),
    path: '',
    fileId: '',
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
  };

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
  };

  // 待确定规则  保存规则  确定模态框  saveRuleoBject
  saveRuleModalOk = () => {
    const { dispatch } =  this.props;
    const { path, saveRuleoBject, userInfo, modelValue } = this.state;  // 获取所有用户 userInfo
    const user = userInfo;
    const rootIds = user.root_ids;
    const taskId = saveRuleoBject.id;
    const savePath = path;
    const fileid = this.state
    const saveFildId = fileid.fileId;
    dispatch({
      type: 'core/getRuleConfirmRule',
      payload:{ savePath, rootIds, taskId, saveFildId, modelValue },
      callback: () => {
        this.saveRuleModalCancel();  // 待确定规则  保存规则  取消模态框
        this.coreRuleTasks();        // 待确认规则 全部列表
      } 
    });
  }

  getModel = item => {
    this.setState({
      modelValue: item,
    })
  }

  // 待确定规则 弹出  保存规则  模态框
  showSaveRuleModal = item => {
    this.setState({
      saveRuleVisible: true,    // 待确定规则模态框属性
      saveRuleoBject: item,     // 获取列表某一行参数值
    });
  }

  // 待确定规则  保存规则  取消模态框
  saveRuleModalCancel = () => {
    this.setState({
      saveRuleVisible: false,
    });
  };

  



// ---------------------------------------------------发送规则
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
      isRoute: true,            // 发送规则  用于判断调用新建还是修改
      visibles: true,           // 发送规则抽屉属性
      drawerParameter: {},      // 发送规则  存储某行对象参数
    });
    this.ruleGetUserGetRootGroup();     // 接收方
  };

  // 发送规则 新建规则 抽屉 点击保存按钮
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

  // 发送规则 新建规则  提交方法
  urleGetSubmitRule = fields => {
    const { dispatch } =  this.props;
    const { userInfo } = this.state;
    const user = userInfo;
    const createBy = getUserId()
    const rootIds = user.root_ids;
    const path = this.state;
    const fileid = this.state
    const sourceFileId = fileid.fileId;
    const sourcePath = path.path;
    dispatch({
      type: 'core/getSubmitRule',
      payload:{ ...fields, createBy, rootIds, sourcePath, sourceFileId },
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
      isRoute: false,            // 发送规则  false调用修改
      visibles: true,            // 发送规则抽屉属性
      drawerParameter: item,     // 发送规则  存储某行对象参数
    });
    this.ruleGetUserGetRootGroup();     // 接收方
  };

  // 发送规则 修改  提交方法
  coreRuleUpdate = fields => {
    const { dispatch } = this.props;
    const { path, drawerParameter } = this.state;
    const createBy = getUserId();
    const {ruleId} = drawerParameter;

    // 用于判断修改规则 有没有选源路径 如选则用新路径，无则用就路径
    let sourcePath = "";
    if(path === ""){
      sourcePath = fields.pathValue;
    }else{
      sourcePath = path;
    }
    
    const fileid = this.state
    const sourceFileId = fileid.fileId;
    dispatch({
      type: 'core/getRuleUpdate',
      payload:{ ...fields, createBy, sourcePath, ruleId, sourceFileId },
      callback: () => {
        this.coreRuleMyRule();    // 我的规则   发送规则
      } 
    });
  }

  // 发送规则  新建和修改共用  源路径
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

  // 发送规则  新建和修改共用  源路径
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

  // 发送规则  新建和修改共用  源路径
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
      content: `确定删除“${ item.ruleName }”吗？`,
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
      callback: () => {
        this.coreRuleMyRule();   // 我的规则   发送规则 
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
        const confirmedArr = [];         // 已确认数组
        const uncertaintyArr = [];       // 未确认数组
        const itemData = rel.data;
        // eslint-disable-next-line no-restricted-syntax
        for(const i of itemData){
          if(i.confirmTime === null){
            uncertaintyArr.push(i);
          }else{
            confirmedArr.push(i);
          }
        }
        this.setState({
          ruleDetailsList: confirmedArr,          // 发送规则  接收人员列表 已确认数组
          ruleUncertaintyList: uncertaintyArr,    // 发送规则  接收人员列表 未确认数组
          receiverListRuleId: item.ruleId,        // 发送规则  接收人员列表 每列ruleId
          receiverName: item.ruleName,            // 发送规则  接收人员列表 每列规则名
        })
      } 
    });
    this.setState({
      visibleList: true,
    });
    this.ruleGetUserGetRootGroup();   // 发送规则 新建规则   接收方  目录结构
    this.addHandleChange([], []);     // 发送规则 接收人员列表  修改接收规则人
  }

  // 发送规则 接收人员列表  修改接收规则人
  addHandleChange = (key, item) => {
    const addContactsName = [];   // 发送规则  接收人员列表 添加收方名数组
    if(key.length > 0){
      // eslint-disable-next-line no-restricted-syntax
      for(const i of item){
        addContactsName.push(i.ref);
      }
    }
    this.setState({
      ruleAddUserNameList: addContactsName,
    })
    this.state.ruleAddUserIdList = key;
  }

  // 发送规则 接收人员列表  删除已确认用户
  deleteDetermine = item => {
    const { ruleDetailsList } = this.state;
    const addContactsName = [];
    // eslint-disable-next-line no-restricted-syntax
    for(const i of ruleDetailsList){
      if(item !== i.userId){
        addContactsName.push(i);
      }
    }              
    this.state.ruleDetailsList = addContactsName;     // 删除保存 已确定数组
  }

  // 发送规则 接收人员列表  删除未确认用户
  deleteUncertainty = item => {
    const { ruleUncertaintyList } = this.state;
    const addUncertaintyName = [];
    // eslint-disable-next-line no-restricted-syntax
    for(const i of ruleUncertaintyList){
      if(item !== i.userId){
        addUncertaintyName.push(i);
      }
    }
    this.state.ruleUncertaintyList = addUncertaintyName;     // 删除保存 未确定数组
  }

  // 接收人员列表 修改提交
  receiveOk = () => {
    const { dispatch } =  this.props;
    // ruleDetailsList       已确认数组
    // ruleUncertaintyList   未确认数组
    // ruleAddUserIdList     添加收方ID数组
    const { receiverListRuleId, ruleDetailsList, ruleUncertaintyList, ruleAddUserIdList } = this.state;
    if(ruleDetailsList.length > 0){
      // eslint-disable-next-line no-restricted-syntax
      for(const i of ruleDetailsList){
        ruleAddUserIdList.push(i.userId);
      }
    }
    if(ruleUncertaintyList.length > 0){
      // eslint-disable-next-line no-restricted-syntax
      for(const i of ruleUncertaintyList){
        ruleAddUserIdList.push(i.userId);
      }
    }

    // 去重
    const renderArr = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < ruleAddUserIdList.length; i++) {
      if(renderArr.indexOf(ruleAddUserIdList[i]) === -1){
        renderArr.push(ruleAddUserIdList[i]);
      }
    }
    dispatch({
      type: 'core/getRuleConfirmDelete',
      payload:{ renderArr, receiverListRuleId },
      callback: () => {
        this.coreRuleMyRule();   // 我的规则   发送规则 
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




// ---------------------------------------------------接收规则
  // 接收规则 列表
  coreConfirmRule = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'core/getConfirmRule',
      payload:{ userId },
    });
  }

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
    const { path, receiveCurrent } = this.state;
    const {id} = receiveCurrent;
    const {rootIds} = receiveCurrent;
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
  
  // 接收规则  修改规则  取消模态框
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
      allGroupUser,
      isRoute,
      drawerParameter,
      ruleDetailsList,
      ruleUncertaintyList,
      ruleAddUserNameList,
      acceptanceRule,
      receiveCurrent,
      treeData,
      receiverName,
    } = this.state;
    
    // 待处理规则
    const columns1 = [
      {
        title: '规则名',
        dataIndex: 'ruleName',
      },
      {
        title: '发送方',
        dataIndex: 'createBy',
        render:(text, record)=>{
          return <div>{record.createByName}</div>;
        }
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
        title: '规则名',
        dataIndex: 'ruleName',
      },
      {
        title: '源路径',
        dataIndex: 'sourcePathName',
      },
      {
        title: '文件名规则',
        dataIndex: 'fileName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '备注',
        dataIndex: 'desc',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.coleGetRileDetails(record)}>接收人员列表</a>
            <Divider type="vertical" />
            <a onClick={() => this.showUpdateDrawer(record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.coreRuleMyRuleDelete(record)}>删除</a>
          </Fragment>
        ),
      },
    ]; 

    // 接收规则
    const columns3 = [
      {
        title: '规则名',
        dataIndex: 'ruleName',
      },
      {
        title: '保存路径',
        dataIndex: 'savePathName',
      },
      {
        title: '发送人',
        dataIndex: 'receiverUserName',
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
            <a onClick={() => this.showReceiveModal(record)}>修改</a>
            <Divider type="vertical" style={{display:'none'}} />
          </Fragment>
        ),
      },
    ]; 

    // 发送规则   新建
    const getAddForm = () => {
      return (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label="规则名">
                {getFieldDecorator('ruleName', {
                  rules: [{ required: visibles, message: '请输入规则名! ' }],
                  initialValue: drawerParameter.ruleName,
                })(<Input placeholder="请输入规则名" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} style={{ display: isRoute ? 'none' : 'block'}}>
            <Col span={16}>
              <FormItem label="当前路径 (如不选新源路径，则用当前源路径)">
                <span style={{color:'#1890FF'}}>{drawerParameter.sourcePathName}</span>
              </FormItem>
            </Col>
          </Row>
          {/* 隐藏域 */}
          <Row gutter={16} style={{ display: 'none'}}>
            <Col span={16}>
              <FormItem label="当前路径ID">
                {getFieldDecorator('pathValue', {
                  rules: [{ required: false}],
                  initialValue: drawerParameter.sourcePath,
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
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label="文件名规则">
                {getFieldDecorator('fileName', {
                  rules: [{ required: true, message: '请输入文件名规则! '}],
                  initialValue: drawerParameter.fileName,
                })(<Input placeholder="请输入文件名规则" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} style={{ display: isRoute ? 'block' : 'none'}}>
            <Col span={16}>
              <FormItem label="接收方">
                {getFieldDecorator('userIds', {
                  rules: [{ required: isRoute, message: '请选择接收方名! ' }],
                })(
                  <Select mode="multiple" placeholder="请选择收方名">
                    {allGroupUser.map(ruleArr => {
                      // eslint-disable-next-line camelcase
                      const { group: { group_name } } = ruleArr
                      // eslint-disable-next-line camelcase
                      return <Option key={ruleArr.id} value={ruleArr.id}>{`${group_name}.${ruleArr.nick_name}`}</Option>
                    })}
                  </Select>
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
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['tab1']}
            defaultOpenKeys={['1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            <Menu.Item key="tab1" title="待确认规则" onClick={this.leftSidebarToggle} style={{marginTop: '0px'}}>
              <Icon type="home" />待确认规则
            </Menu.Item>
            <SubMenu
              key="1"
              title={<span><Icon type="appstore" /><span>我的规则</span></span>}
            >
              <Menu.Item key="tab2" title="发送规则" onClick={this.leftSidebarToggle} style={{marginTop: '0px'}}>发送规则</Menu.Item>
              <Menu.Item key="tab3" title="接收规则" onClick={this.leftSidebarToggle} style={{marginTop: '0px'}}>接收规则</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>规则中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{margin: subEdit ? '10px 0px' : '10px 0 25px 0px',}} />
          <div style={{display: subEdit ? 'block' : 'none', marginBottom: '10px' }}>
            <Button icon="plus" type="primary" onClick={this.showDrawer}>新建</Button>
          </div>
          { contentList[operationkey] }
        </Content>

        {/* 待确定规则（确定） */}
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
            <Form layout="horizontal">
              <Form.Item {...formItemLayout} className={styles.stepFormText} label="发送方">
                {saveRuleoBject.createByName}
              </Form.Item>
              <Form.Item {...formItemLayout} className={styles.stepFormText} label="规则描述">
                {saveRuleoBject.ruleName}
              </Form.Item>
              <Divider style={{ margin: '24px 0' }} />
              <Form.Item {...formItemLayout} label="同步规则" required={false}>
                <Select placeholder="请选择规则" defaultValue="all" onChange={this.getModel} style={{ width: '50%' }}>
                  <Option key="all" value="all">全部</Option>
                  <Option key="toDay" value="toDay">当天</Option>
                  <Option key="current" value="current">当前</Option>
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="选择路径" required={false}>
                <Tree loadData={this.onLoadData} onSelect={this.getOnSelect}>{this.renderTreeNodes(treeData)}</Tree>
              </Form.Item>
            </Form>
          </Card>
        </Modal>     

        {/* 发送规则  接收人员列表 */}
        <Modal
          title="接收人员列表"
          width={640}
          bodyStyle={{padding: '10px 55px'}}
          destroyOnClose
          visible={visibleList}
          onOk={this.receiveOk}
          onCancel={this.receiveCancel}
        >
          <DescriptionList size="large" style={{marginBottom:30}}>
            <div style={{ marginLeft:17,fontSize: 16,color: '#000000',marginTop:10 }}>
              规则名： <span style={{fontWeight: 'bold'}}> {receiverName}</span>
            </div>
          </DescriptionList>
          <Divider style={{ marginBottom: 15 }} />
          <DescriptionList size="large" title="已确认用户" style={{marginBottom:25}}>
            <div style={{ marginLeft:17 }}>
              { ruleDetailsList.length > 0 
                  ?
                  ruleDetailsList.map(item => (
                    <Tag 
                      closable 
                      color="cyan" 
                      style={{marginBottom:10}}
                      key={item.id}
                      onClose={() => this.deleteDetermine(item.userId)}
                    >
                      {item.userName}
                    </Tag>
                  )) : <Tag color="cyan" style={{marginBottom:10}}>暂无已确认用户</Tag>
              }
            </div>
          </DescriptionList>
          <Divider style={{ marginBottom: 15 }} />
          <DescriptionList size="large" title="未确认用户" style={{marginBottom:25}}>
            <div style={{ marginLeft:17 }}>
              { ruleUncertaintyList.length > 0 
                  ?
                  ruleUncertaintyList.map(item => (
                    <Tag 
                      closable 
                      color="gold" 
                      style={{marginBottom:10}}
                      key={item.id}
                      onClose={() => this.deleteUncertainty(item.userId)}
                    >
                      {item.userName}
                    </Tag>
                  )) : <Tag color="gold" style={{marginBottom:10}}>暂无未确定用户</Tag>
              }
            </div>
          </DescriptionList>
          <Divider style={{ marginBottom: 15 }} />
          <DescriptionList size="large" title="添加接收规则人" style={{marginBottom:25}}>
            <div style={{ marginLeft:17 }}>
              { ruleAddUserNameList.length > 0 
                ?
                ruleAddUserNameList.map((item, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Tag color="blue" key={i} style={{marginBottom:10}}>
                    {item}
                  </Tag>
                )) : <Tag color="blue" style={{marginBottom:10}}>暂无添加接收规则人</Tag>
              }
            </div>
          </DescriptionList>
          <DescriptionList size="large" title="选择收方名" style={{ marginBottom: 25 }}>
            <div style={{ marginLeft:17 }}>
              <Select mode="multiple" placeholder="请选择收方名" onChange={this.addHandleChange} style={{ width: '70%' }}>
                {allGroupUser.map(ruleArr => {
                  // eslint-disable-next-line camelcase
                  const { group: { group_name } } = ruleArr
                  // eslint-disable-next-line camelcase
                  return <Option key={ruleArr.id} ref={`${group_name}.${ruleArr.nick_name}`}>{`${group_name}.${ruleArr.nick_name}`}</Option>
                })}
              </Select>
            </div>
          </DescriptionList>
        </Modal>

        {/* 发送规则  新建规则 */}
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
                {receiveCurrent.receiverUserName}
              </Form.Item>
              <Form.Item {...formItemLayout} className={styles.stepFormText} label="规则描述">
                {receiveCurrent.ruleName}
              </Form.Item>
              <Divider style={{ margin: '24px 0' }} />
              <Form.Item {...formItemLayout} label="源保存路径" required={false}>
                <span style={{color:'#1890FF'}}>{receiveCurrent.sourcePathName}</span>
              </Form.Item>
              <Form.Item {...formItemLayout} label="修改路径" required={false}>
                <Tree loadData={this.onLoadData} onSelect={this.getOnSelect}>{this.renderTreeNodes(treeData)}</Tree>
              </Form.Item>
            </Form>
          </Card>
        </Modal>

      </Layout>
    );
  }
}

export default RuleCore;
