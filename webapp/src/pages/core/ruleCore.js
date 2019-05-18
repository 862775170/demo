import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { 
  Layout, 
  Menu, 
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
  Tree, 
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import moment from 'moment';
import { log } from 'util';

const { TreeNode } = Tree;
const { Description } = DescriptionList;
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
    isEdit: false,
    done: false,
    subEdit: false,
    crumbs: '待确认规则',
    operationkey: 'tab1',
    fileArr: [],   //源路径
    allGroupUser: [],
    userId: sessionStorage.getItem('userid'),
    taskId: '',   //储存  弹出  保存  模态框
    visibles: false,
    treeData: [
      { filename_KeywordIkPinyin:'/' ,file_id:sessionStorage.getItem('rootIds') }
    ],
    path: '',

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
        isEdit: true,
      })
      this.coreRuleMyRule();  // 我的规则   发送规则
    }
    // 确认规则
    if(item.key === "tab3"){
      this.coreConfirmRule();
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

  // 我的规则   发送规则
  coreRuleMyRule = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'core/getRuleMyRule',
      payload:{ userId },
    });
  }

  // 我的规则   确认规则
  coreConfirmRule = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'core/getConfirmRule',
      payload:{ userId },
    });
  }

  //  弹出  保存  模态框
  showRouteModal = item => {
    this.setState({
      visible: true,
      isEdit: true,
      visibles: false,
      taskId: item.id,
    });
  }

  // 源路径
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

  // 接收方  目录结构
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
  // 接收方 
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

  // 模态框 点击保存按钮
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { isEdit } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(isEdit){
        this.urleGetRuleConfirmRule(fieldsValue);
      }else{  
        this.urleGetSubmitRule(fieldsValue);   //新建规则提交方法
      }
      this.handleCancel();   // 模态框 附属性
    });
    
  };
  // 新建规则提交方法
  urleGetSubmitRule = fields => {
    const { dispatch } =  this.props;
    const userInfo = sessionStorage.getItem("userInfo");
    const user = JSON.parse(userInfo);
    const createBy = user.nick_name;
    const path = this.state;
    const savePath = path.path;
    dispatch({
      type: 'core/getSubmitRule',
      payload:{ ...fields, createBy, savePath },
      callback: () => {
        this.coreRuleMyRule();    // 我的规则   发送规则
        this.onClose();   //关闭抽屉
      } 
    });
  }

  // 待确定规则  保存
  urleGetRuleConfirmRule = fields => {
    const { dispatch } =  this.props;
    const { taskId } = this.state;
    dispatch({
      type: 'core/getRuleConfirmRule',
      payload:{ ...fields, taskId },
      callback: () => {
        this.coreRuleTasks();
      } 
    });
  }

  // 模态框 附属性
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  //抽屉  源路径实现方法  start
  showDrawer = () => {
    this.setState({
      visibles: true,
      isEdit: false,
    });
    this.ruleGetUserGetRootGroup();     // 接收方
  };
  onClose = () => {
    this.setState({
      visibles: false,
    });
  };
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
  getOnSelect = (selectedKeys, e) => {
    if(e.selectedNodes.length > 0){
      const path = e.selectedNodes[0].props.dataRef.fullpath;
      this.setState({
        path: path,  //源路径
      });      
    }
  }
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
// eng

  render() {
    const { loading, form: { getFieldDecorator }, core: { coreData }, core: { myData } } = this.props;
    const { 
      isEdit,
      done, 
      visible,
      visibles, 
      crumbs, 
      operationkey, 
      subEdit, 
      fileArr, 
      allGroupUser,
    } = this.state;

    // 模态框 确定  取消按钮
    const modalFooter = done
      ? { footer: null, onCancel: this.handleCancel }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    
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
        title: '时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },  
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showRouteModal(record)}>确认</a>
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
        dataIndex: 'sourcePath',
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
            <a onClick={() => this.showRouteModal(record)}>详情</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showRouteModal(record)}>删除</a>
          </Fragment>
        ),
      },
    ]; 

    // 确定规则
    const columns3 = [
      {
        title: '规则描述',
        dataIndex: 'ruleName',
      },
      {
        title: '目标路径',
        dataIndex: 'savePath',
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
            <a onClick={() => this.showRouteModal(record)}>详情</a>
            <Divider type="vertical" style={{display:'none'}}/>
          </Fragment>
        ),
      },
    ]; 

    const getRouteForm = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...this.formLayout} label="更改路径">
            {getFieldDecorator('savePath', {
              rules: [{ 
                required: isEdit, 
                message: '请输入更改路劲! '
              }],
            })(<Input placeholder="请输入路劲" />)}
          </FormItem>
        </Form>
      );
    };

    // 新建按钮
    const getAddForm = () => {
      return (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="规则名">
                {getFieldDecorator('ruleName', {
                  rules: [{ required: visibles, message: '请输入规则名! ' }],
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
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="接收方">
                {getFieldDecorator('userIds', {
                  rules: [{ required: visibles, message: '请选择接收方名! ' }],
                })(
                  <Select mode="multiple" placeholder="请选择收方名">
                    {allGroupUser.map(ruleArr => (
                      <Option key={ruleArr.id} value={ruleArr.id}>
                        { ruleArr.user_name }
                      </Option>
                    ))}
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

    const contentList = {
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

    return (
      <Layout>
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
              title={
                <span>
                  <Icon type="appstore" />
                  <span>我的规则</span>
                </span>
              }
            >
              <Menu.Item key="tab2" title="发送规则" onClick={this.leftSidebarToggle}>发送规则</Menu.Item>
              <Menu.Item key="tab3" title="接收规则" onClick={this.leftSidebarToggle}>接收规则</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb style={{height: '36px',lineHeight: '25px'}}>
            <Breadcrumb.Item>规则中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{display: subEdit ? 'block' : 'none' }}>
            <Button icon="plus" type="primary" onClick={this.showDrawer}>新建</Button>
          </div>
          <Divider style={{marginTop: '10px'}}/>
          { contentList[operationkey] }
        </Content>

        {/* 保存规则 */}
        <Modal
          title={done ? null : '保存规则'}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getRouteForm()}
        </Modal>

        {/* 新建规则 */}
        <Drawer
          title="新建规则"
          width={720}
          onClose={this.onClose}
          visible={this.state.visibles}
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


      </Layout>
    );
  }
}

export default RuleCore;
