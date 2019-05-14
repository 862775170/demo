import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  // message,
  // Badge,
  Divider,
  // Steps,
  // Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './Account.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ cust, loading }) => ({
    cust,
  loading: loading.models.cust,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    visible: false,
    done: false,
    isEdit: false
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  
  columns = [
  
    {
      title: '菜单名称',
      dataIndex: 'menuName',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '访问路径',
      dataIndex: 'url',
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showModal(record)}>新建</a>
          <Divider type="vertical" />
          <a onClick={() => this.showEditModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.editAndDelete(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cust/fetch',
    });
  }

  

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'cust/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'cust/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'cust/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'cust/fetch',
        payload: values,
      });
    });
  };

  // handleModalVisible = flag => {
  //   this.setState({
  //     modalVisible: !!flag,
  //   });
  // };
  showModal = (item) => {
    this.setState({
      visible: true,
      current: item ? {menuId: item.menuId} : undefined,
      isEdit: false
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
      isEdit: true
    });
  };

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  editAndDelete = (currentItem) => {
    Modal.confirm({
      title: '删除',
      content: `确定删除“${currentItem.menuName}”吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem),
    });
  };  

  deleteItem = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cust/remove',
      payload: {
        ...record
      },
      callback: () => {
        dispatch({
          type: 'cust/fetch',
        });
      },
    });
  }

  handleUpdate = fieldsValue => {
    const { dispatch } = this.props;
    const { current } = this.state;
    const menuId = current ? current.menuId : '';
    dispatch({
      type: 'cust/update',
      payload: { menuId, ...fieldsValue },
      callback: () => {
        dispatch({
          type: 'cust/fetch',
        });
      }
    });
  }

  handleAdd = fieldsValue => {
    const { dispatch } = this.props;
    const { current } = this.state;
    const parentId = current ? current.menuId : 0;
    dispatch({
      type: 'cust/add',
      payload: { parentId, ...fieldsValue },
      callback: () => {
        dispatch({
          type: 'cust/fetch',
        });
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { isEdit } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      if(isEdit){
        this.handleUpdate(fieldsValue);
      }else{        
        this.handleAdd(fieldsValue);
      }
    });
  };



  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      cust: { data },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, visible, done, current = {}, isEdit } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

      const getModalContent = () => {
        if (done) {
          return (
            <Result
              type="success"
              title="操作成功"
              description="一系列的信息描述，很短同样也可以带标点。"
              actions={
                <Button type="primary" onClick={this.handleDone}>
                  知道了
                </Button>
              }
              className={styles.formResult}
            />
          );
        }
        return (
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="菜单名称" {...this.formLayout}>
              {getFieldDecorator('menuName', {
                rules: [{ required: true, message: '请输入菜单名称' }],
                initialValue: current.menuName,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="排序" {...this.formLayout}>
              {getFieldDecorator('orderNum', {
                rules: [{ required: true, message: '请输入排序' }],
                initialValue: current.orderNum,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="访问路径" {...this.formLayout}>
              {getFieldDecorator('url', {
                rules: [{ required: true, message: '请输入访问路径' }],
                initialValue: current.url,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="权限标识" {...this.formLayout}>
              {getFieldDecorator('perms', {
                rules: [{ required: true, message: '请输入权限标识' }],
                initialValue: current.perms,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="图标" {...this.formLayout}>
              {getFieldDecorator('icon', {
                rules: [{ required: true, message: '请输入图标' }],
                initialValue: current.icon,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        );
      };
    return (
      <PageHeaderWrapper title="菜单管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showModal()}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey='menuId'
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              pagination={false}
              hideAlert
            />
          </div>
        </Card>
       
        <Modal
          title={done ? null : `菜单${isEdit ? '编辑' : '新建'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
