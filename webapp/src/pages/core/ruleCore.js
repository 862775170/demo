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
  TreeSelect 
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import moment from 'moment';

const { Description } = DescriptionList;
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { SubMenu } = Menu;
const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;

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
      this.coreRuleMyRule();
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
      isEdit: false,
      taskId: item.id,
    });
    
  }

  //  弹出  新建 模态框
  showEditModal = () => {
    this.setState({
      visible: true,
      isEdit: true,
    });
    this.ruleGetFileList();             // 源路径
    this.ruleGetUserGetRootGroup();     // 接收方
  };

  // 源路径
  ruleGetFileList = () => {
    const { dispatch } = this.props;
    const fileId = sessionStorage.getItem('rootIds');
    dispatch({
      type: 'core/getFileList',
      payload:{ fileId },
      callback: (result) => {
        this.state.fileArr = result.result;
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
        this.urleGetSubmitRule(fieldsValue);   //新建规则提交方法
      }else{        
        this.urleGetRuleConfirmRule(fieldsValue);
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
    dispatch({
      type: 'core/getSubmitRule',
      payload:{ ...fields, createBy },
      callback: () => {
        this.coreRuleMyRule();
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

  render() {
    const { loading, form: { getFieldDecorator }, core: { coreData }, core: { myData } } = this.props;
    const { 
      isEdit,
      done, 
      visible, 
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
            <a onClick={() => this.showRouteModal(record)}>保存</a>
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
      }
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
      }
    ]; 

    const getRouteForm = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...this.formLayout} label="更改路径">
            {getFieldDecorator('savePath', {
              rules: [{ 
                required: true, 
                message: '请输入更改路劲! '
              }],
            })(<Input placeholder="请输入路劲" />)}
          </FormItem>
        </Form>
      );
    };

    //新建按钮
    const getAddForm = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...this.formLayout} label="规则名">
            {getFieldDecorator('ruleName', {
              rules: [{ 
                required: true, 
                message: '请输入规则名! '
              }],
            })(<Input placeholder="请输入规则名" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="源路径">
            {getFieldDecorator('sourcePath', {
              rules: [{ 
                required: true, 
                message: '请选择要存储的源路径!'
              }],
            })(
              <Select placeholder="请选择源路径">
                {fileArr.map(fileData => (
                  <Option key={fileData.file_id} value={fileData.file_id}>
                    { fileData.filename_KeywordIkPinyin }
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="接收方">
            {getFieldDecorator('userIds', {
                rules: [{
                  required: true, 
                  message: '请选择接收方名称! '
                }],
            })(
              <Select mode="multiple" placeholder="请选择收方名称">
                {allGroupUser.map(ruleArr => (
                  <Option key={ruleArr.id} value={ruleArr.id}>
                    { ruleArr.user_name }
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
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
          rowKey="id"
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
              <Menu.Item key="tab3" title="确认规则" onClick={this.leftSidebarToggle}>确认规则</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb style={{height: '36px',lineHeight: '25px'}}>
            <Breadcrumb.Item>规则中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{display: subEdit ? 'block' : 'none' }}>
            <Button icon="plus" type="primary" onClick={() => this.showEditModal()}>新建</Button>
            <Divider style={{marginTop: '10px'}}/>
          </div>
          { contentList[operationkey] }
        </Content>

        <Modal
          title={done ? null : `${isEdit ? '新建' : '保存'}规则`}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {isEdit ? getAddForm() : getRouteForm()}
        </Modal>
      </Layout>
    );
  }
}

export default RuleCore;
