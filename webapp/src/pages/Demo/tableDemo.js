import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import router from 'umi/router';
import {
  // Row,
  // Col,
  Card,
  Form,
  Input,
  // Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  // InputNumber,
  // DatePicker,
  Modal,
  message,
  // Badge,
  Divider,
  // Steps,
  // Radio,
  // Tag
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Result from '@/components/Result';
import defaultConfig from '../defaultConfig';

import styles from './tableDemo.less';


const { defaultPagination } = defaultConfig;
const FormItem = Form.Item;
const { Search } = Input;
// const { Option } = Select;
// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ demo, loading }) => ({
  demo,
  loading: loading.models.demo,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    // formValues: {},
    visible: false,
    isEdit: false,
    currentPagiantion: defaultPagination
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  
  
  columns = [
    {
      title: '角色ID',
      dataIndex: 'roleId',
      sortDirections: ['ascend','descend'],
      sorter:()=>{}
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色状态',
      dataIndex: 'roleStatus',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => val?<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>:null,
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          <a onClick={() => this.showModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.onClickDelete(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.updatedTableData();
  }

  // 更新当前分页信息
  setCurrentPagiantion = (page) => {
    this.setState({
      currentPagiantion: page,
    });
  };

  // 更新表格数据
  updatedTableData = () => {
    const { dispatch } = this.props;
    const { currentPagiantion } = this.state;
    dispatch({
      type: 'demo/getTableData',
      payload: currentPagiantion
    });
  };

  // 点击修改或新建按钮
  showModal = (item) => {
    this.setState({
      visible: true,
      current: item || undefined,
      isEdit: !!item,
    });
  };

  // 保存修改或新建
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { isEdit } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(isEdit){
        this.handleUpdate(fieldsValue);
      }else{        
        this.handleAdd(fieldsValue);
      }
    });
  };

  // 提交新建
  handleAdd = fieldsValue => {
    const { dispatch } = this.props;
    const menuIds =  [1];
    dispatch({
      type: 'demo/add',
      payload: { menuIds, ...fieldsValue },
      callback: (response) => {
        message.success(response.msg);
        if(response.retCode === "200"){
          this.setState({
            visible: false,
          });
          this.updatedTableData();
        }
      },
    });
  }

  // 提交修改
  handleUpdate = fieldsValue => {
    const { dispatch } = this.props;
    const { current } = this.state;
    const roleId = current ? current.roleId : '';
    const menuIds =  [1];
    dispatch({
      type: 'demo/update',
      payload: { roleId, menuIds, ...fieldsValue },
      callback: (response) => {
        message.success(response.msg);
        if(response.retCode === "200"){
          this.setState({
            visible: false,
          });
          this.updatedTableData();
        }
      },
    });
  }

  // 点击删除按钮
  onClickDelete = (currentItem) => {
    Modal.confirm({
      title: '删除',
      content: `确定删除“${currentItem.roleName}”吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.okDelete(currentItem),
    });
  }; 

  // 确定删除按钮
  okDelete = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demo/removeItem',
      payload: {
        ...item
      },
      callback: (response) => {
        this.updatedTableData();
        message.success(response.msg);
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const page = {
      current: pagination.current,
      size: pagination.pageSize,
    }
    if(sorter.field){
      if(sorter.order==="ascend"){
        page.ascs = sorter.columnKey;
      }else if(sorter.order==="descend"){
        page.descs = sorter.columnKey
      }
    }
    this.setCurrentPagiantion(page);
    setTimeout(() => {
      this.updatedTableData();
    }, 100);
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

      // this.setState({
      //   formValues: values,
      // });

      dispatch({
        type: 'demo/getTableData',
        payload: values,
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      demo: { data },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, visible, current = {}, isEdit } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const modalFooter =  { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => {
        return (
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="角色名称" {...this.formLayout}>
              {getFieldDecorator('roleName', {
                rules: [{ required: true, message: '请输入角色名称' }],
                initialValue: current.roleName,
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="角色状态" {...this.formLayout}>
              {getFieldDecorator('roleStatus', {
                rules: [{ required: true, message: '请输入角色状态' }],
                initialValue: current.roleStatus,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
        );
      };
    return (
      <PageHeaderWrapper title="表格demo(角色列表为例)">
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

              <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
            </div>
            <StandardTable
              rowKey='roleId'
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              hideAlert
            />
          </div>
        </Card>
       
        <Modal
          title={`角色${isEdit ? '编辑' : '新建'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
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
