import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {Card, Form, Input, Button, Modal, Divider, message,Tag, Select, Popconfirm} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardFormRow from '@/components/StandardFormRow';
import TagSelect from '@/components/TagSelect';
import styles from './userManage.less';

const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;

@connect(({ system, loading }) => ({
  system,
  loading: loading.models.system,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    done: false,
    isEdit: true,
    visible: false,
    help: '',
    roleList: [],
    roleIds: [],
    userName: '',
    children: [],
    roleValue: [],
  };

  // 创建用户lable 和 input 布局
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  columns = [
    {
      title: '账户',
      dataIndex: 'userName',
      sorter: true,
    },
    {
      title: '姓名',
      dataIndex: 'displayName',
      sorter: true,
    },
    {
      title: '用户角色',
      dataIndex: 'roleName',
      sorter: false,      
      render: roleName => (
        roleName?<span>{roleName.split(',').map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}</span>            
      :<span>{roleName}</span>            
      )
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
      sorter: true,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      sorter: true,
    },
    {
      title: '电话',
      dataIndex: 'phoneNo',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title="确定要重置密码?" onConfirm={() => this.resetPassword(record)}>
            <a href="">重置密码</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  // 初始化用户管理列表
  componentDidMount() {
    this.getRoleList();     // 用户管理   角色名称接口
    this.getUserList();     // 用户管理列表
  }

  // 用户管理   角色名称接口
  getRoleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/roleList',
      callback: (result) => {      //  result属于创建成功回调，用roleList数组存储
        this.state.roleList = result.data.records;
      }
    });
  }

  // 用户管理列表
  getUserList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userList',
      payload: {
        ...this.state,
        currentPage: 1,
        pageSize: 10,
      }
    });
  }

  handleSelectRows = rows => { 
    this.setState({ 
      selectedRows: rows 
    })
  }

  // 点击分页按钮方法
  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      field: sorter.field,    // 排序指定字段
      order: sorter.order,   // 排序
    };
    dispatch({
      type: 'system/userList',
      payload: {
        ...this.state,
        ...params,
      }
    });
  }

  // 点击新建按钮  弹出  模态框
  showModal = (item) => {
    this.setState({
      roleValue: [],
      visible: true,
      current: item ? {menuId: item.menuId} : undefined,
      isEdit: true,
      help: '',   // 初始化密码提示
    });
  };

  // 点击修改按钮  弹出  模态框
  showEditModal = item => { 
    this.setState({
      visible: true,
      current: item,
      isEdit: false,
      help: '',   // 初始化密码提示
    });
    // 根据userid 单独查询角色分配
    const { dispatch } = this.props;
    const { userId } = item
    dispatch({
      type: 'system/getRoles',  
      payload:{userId},
      callback: (result) => {
        const roleIds = result.data.map(s => s.roleId);
        this.setState({roleValue:roleIds})
      } 
    })   
  };
  
  // 模态框 附属性
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 点击保存按钮
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { isEdit } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(isEdit){
        this.handleAdd(fieldsValue);
      }else{        
        this.handleUpdate(fieldsValue);
      }
      this.handleCancel();   // 调用关闭模态框方法
    });
  };

  // 点击新建确定按钮 成功提示
  handleAdd = fieldsValue => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userAdd',  // url请求路径 -> models/system.js ->  userAdd
      payload: { ...fieldsValue },
      callback: () => {      // 创建成功重调列表方法  result属于创建成功回调
        this.getUserList(); // 用户管理列表
      }
    });
  }

  // 点击修改 确定按钮 成功提示
  handleUpdate = fields => {
    const { dispatch } = this.props;
    // 传参  userId
    const { current } = this.state;
    const { userId } = current;   
    dispatch({
      type: 'system/userUpdate',
      payload: { userId, ...fields },
      callback: () => {      // 创建成功重调列表方法  result属于创建成功回调
        this.getUserList(); // 用户管理列表
      }
    });
  };

  // 重置密码
  resetPassword = (key) => {
    const { dispatch } = this.props;
    // 传参  userId
    const { userId } = key;   
    dispatch({
      type: 'system/postResetPwd',
      payload: { userId },
      callback: (result) => {
        if(result.retCode === '200'){
          message.success('重置密码成功，已发送到该用户！');
        }else{
          message.error('重置密码失败！');
        }
      }
    });
  }

  // 填写密码验证
  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty, isEdit } = this.state;
    if(isEdit){  // 判断是添加还是修改用户信息 为 true & false 点击添加为true进入判断验证密码，点击修改则反
      if (!value) {
        this.setState({
          help: formatMessage({ id: 'validation.password.required' }),
        });
        callback('error');
      } else {
        this.setState({
          help: '',
        });
        if (!visible) {
          this.setState({
            visible: !!value,
          });
        }
        if (value.length < 10) {
          this.setState({
            help: formatMessage({ id: 'systemAdmin.password.wrong-format' }),
          });
          callback('error');
        } else {
          const { form } = this.props;
          if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
          }
          callback();
        }
      }
    }else{
      callback();
    }
  };

  // 确定密码验证
  checkConfirm = ( rule, value, callback ) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('pwd')) {
      callback(formatMessage({ id: 'systemAdmin.password.twice' }));
    } else {
      callback();
    }
  };

  // 点击角色进行数据查询
  setRoleIds = (value) => {
    this.state.roleIds = value;
    this.getUserList();
  }

  // 搜索查询
  setUserName = (event) => {
    const { value } = event.target;
    this.state.userName = value;
    this.getUserList();
  }

  render() {
    const { loading, system: { userData } } = this.props;
    const { selectedRows, done, visible, isEdit, current = {}, help, roleList, roleValue } = this.state;
    // 模态框 输入框控制属性
    const {
      form: { getFieldDecorator },
    } = this.props;
    const modalFooter = done
      ? { footer: null, onCancel: this.handleCancel }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    // 角色收起展开按钮
    const actionsTextMap = {
      expandText: <FormattedMessage id="component.tagSelect.expand" defaultMessage="Expand" />,
      collapseText: (
        <FormattedMessage id="component.tagSelect.collapse" defaultMessage="Collapse" />
      ),
    };

    const getAddForm = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          {/* 新建用户 */}
          <FormItem {...this.formLayout} label="账号" style={{ display: isEdit ? 'block' : 'none' }}>
            {getFieldDecorator('userName', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'systemAdmin.user-name.wrong-format' }), 
                pattern: /^[a-zA-Z0-9]{3,32}$/
              }],
              initialValue: current.userName,
            })(<Input placeholder="请输入账号" />)}
          </FormItem>
          {/* 修改用户 账户名不允许被修改 */}
          <FormItem {...this.formLayout} label="账号" style={{ display: isEdit ? 'none' : 'block' }}>
            {getFieldDecorator('userName', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'systemAdmin.user-name.wrong-format' }), 
                pattern: /^[a-zA-Z0-9]{3,32}$/
              }],
              initialValue: current.userName,
            })(<Input placeholder="请输入账号" disabled />)}
          </FormItem>

          <FormItem {...this.formLayout} label="姓名">
            {getFieldDecorator('displayName', {
              rules: [{ 
                required: true, 
                message: formatMessage({ id: 'systemAdmin.display-name.wrong-format'}), 
                pattern: /^[\u4e00-\u9fa5]*$/
              }],
              initialValue: current.displayName,
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>

          <FormItem {...this.formLayout} label="密码" help={help} style={{ display: isEdit ? 'block' : 'none' }}>
            {getFieldDecorator('pwd', {
              rules: [{ 
                required: isEdit, 
                message: formatMessage({ id: 'systemAdmin.password.wrong-format'}),
                pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{10,32}$/
              },{ validator: this.checkPassword, }],
              initialValue: current.pwd, 
            })(<Input.Password placeholder="请输入密码" type="password" />)}
          </FormItem>

          <FormItem {...this.formLayout} label="确定密码" style={{ display: isEdit ? 'block' : 'none' }}>
            {getFieldDecorator('confirm', {
              rules: [
                { required: isEdit, message: formatMessage({ id: 'systemAdmin.confirm-password.wrong-format' }) },
                { validator: this.checkConfirm, }
              ],
              initialValue: current.confirm,
            })(<Input.Password placeholder="请确定密码" type="password" />)}
          </FormItem>

          <FormItem {...this.formLayout} label="角色分配">
            {getFieldDecorator('roleIds', {
                rules: [{required: isEdit, message: formatMessage({ id: 'systemAdmin.role.twice' })}],
                initialValue: roleValue,
            })(
              <Select mode="multiple" placeholder="请选择要分配的角色">
                {roleList.map(roleIds => (
                  <Option key={roleIds.roleId} value={roleIds.roleId}>
                    { roleIds.roleName }
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...this.formLayout} label="邮箱">
            {getFieldDecorator('mail', {
              rules: [
                { required: true, message: formatMessage({ id: 'systemAdmin.email.required' }) },
                { type: 'email', message: formatMessage({ id: 'systemAdmin.email.wrong-format' }) }
              ],
              initialValue: current.mail,
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>

          <FormItem {...this.formLayout} label="手机">
            {getFieldDecorator('mobile', {
              rules: [
                { required: false },
                { pattern: /^[1]\d{10}$/, message: formatMessage({ id: 'systemAdmin.phone-Number.wrong-format' }) }
              ],
              initialValue: current.mobile,
            })(<Input placeholder="请输入手机" />)}
          </FormItem>

          <FormItem {...this.formLayout} label="电话">
            {getFieldDecorator('phoneNo', {
              rules: [
                { required: false },
                { pattern: /^[0-9-]{7,13}$/, message: formatMessage({ id: 'systemAdmin.phone-No.wrong-format'})}
              ],
              initialValue: current.phoneNo,
            })(<Input placeholder="请输入电话" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title="用户管理">
        {/* 角色名称 */}
        <Card bordered={false} style={{ marginBottom:'20px' }}>
          <Form layout="inline">
            <StandardFormRow title="角色名称" block style={{ paddingBottom: 11 }}>
              <div className={styles.salesCardExtra}>
                <div className={styles.salesTypeRadio}>
                  <TagSelect hideCheckAll expandable onChange={(value)=> this.setRoleIds(value)} actionsText={actionsTextMap}>
                    {roleList.map((item) => {
                      return<TagSelect.Option key={item.roleId} value={item.roleId}>{ item.roleName }</TagSelect.Option>
                    })}
                  </TagSelect>
                </div>
              </div>
            </StandardFormRow>
          </Form>
        </Card>

        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* 添加按钮 */}
            <div className={styles.tableListOperator} style={{display: '-webkit-inline-box'}}>
              <Button icon="plus" type="primary" onClick={() => this.showModal()}>
                新建
              </Button>
            </div>
            {/* 搜索框 */}
            <div className={styles.extraContent} style={{display: '-webkit-inline-box',float: 'right'}}>
              <Search onChange={value => this.setUserName(value)} onSearch={this.getUserList} className={styles.extraContentSearch} placeholder="请输入" />
            </div>
            
            <StandardTable
              rowKey='userId'
              selectedRows={selectedRows}
              loading={loading}
              data={userData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              onSelectRow={this.handleSelectRows}
              hideAlert
              size="middle"
            />
          </div>
        </Card>
        {/* 新建模态框 */}
        <Modal
          title={done ? null : `${isEdit ? '新建' : '修改'}用户`}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getAddForm()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
