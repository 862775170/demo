import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Layout, 
  Menu, 
  Breadcrumb, 
  Icon, 
  Table,
  Form, 
  Input, 
  Divider,
  Modal,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const { Content, Sider } = Layout;
const FormItem = Form.Item;

@connect(({ core, loading }) => ({
  core,
  loading: loading.models.core,
}))
// 规则中心
@Form.create()
class RuleCore extends PureComponent {

  state = {
    done: false,
    isEdit: false,
    crumbs: '待确认规则',
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

  // 待确认规则 全部列表
  coreRuleTasks = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'core/getRuleTasks'
    });
  }

  // 我的规则 全部列表 接口  
  coreRuleMyRule = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'core/getRuleMyRule'
    });
  }

  // 左边栏切换
  leftSidebarToggle = (item) => {
    if(item.key === "1"){
      this.setState({
        isEdit: false,
        crumbs: '待确认规则',
      })
      this.coreRuleTasks();       // 待确认规则 列表
    }else{
      this.setState({
        isEdit: true,
        crumbs: '我的规则',
      })
      // this.coreRuleMyRule();      //我的规则 全部列表 接口  
    }
  }

  // 模态框 点击保存按钮
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
    });
  };

  //  弹出  模态框
  showEditModal = () => { 
    this.setState({
      visible: true,
      isEdit: false,
    }); 
  };

  // 模态框 附属性
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { loading, form: { getFieldDecorator }, core: { coreData }, core: { myData } } = this.props;
    const { isEdit, done, visible, crumbs } = this.state;

    // 模态框 确定  取消按钮
    const modalFooter = done
      ? { footer: null, onCancel: this.handleCancel }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    
    const columns1 = [
      {
        title: '时间',
        dataIndex: 'ruleName',
      },
      {
        title: '传输人',
        dataIndex: 'createBy',
      },
      {
        title: '文件描述',
        dataIndex: 'createBy1',
      },
      {
        title: '发送间隔',
        dataIndex: 'createBy4',
      },
      {
        title: '发送时间',
        dataIndex: 'createBy115',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record)}>保存</a>
            <Divider type="vertical" style={{display:'none'}} />
          </Fragment>
        ),
      },
    ]; 
    
    const columns2 = [
      {
        title: '最后一次传输时间',
        dataIndex: 'ruleName',
      },
      {
        title: '传输人',
        dataIndex: 'createBy',
      },
      {
        title: '文件描述',
        dataIndex: 'creat5',
      },
      {
        title: '保存路径',
        dataIndex: 'creat4',
      },
      {
        title: '接收人',
        dataIndex: 'create3',
      },
      {
        title: '发送间隔',
        dataIndex: 'create2',
      },
      {
        title: '发送时间',
        dataIndex: 'creat1',
      },
      {
        title: '传输类型',
        dataIndex: 'create1',
      },
      {
        title: '生效时间',
        dataIndex: 'createBy0',
      }
    ]; 

    const getAddForm = () => {
      return (
        <Form onSubmit={this.handleSubmit}>

          <div style={{width:'422px', margin: ' 0 auto'}}>
            <DescriptionList size="large" style={{ marginBottom: 32 }}>
              <div><Description term="好友">1000000000</Description></div>
              <div><Description term="类型">1000000000</Description></div>
              <div><Description term="规则名称">1000000000</Description></div>
              <div><Description term="规则描述">1000000000</Description></div>
              <div><Description term="扫描方式">1000000000</Description></div>
            </DescriptionList>
            <Divider />
          </div>
          
          <FormItem {...this.formLayout} label="存储路径">
            {getFieldDecorator('route', {
              rules: [{ 
                required: true, 
                message: '请输入要存储路径!'
              }],
              // initialValue: current.userName,
            })(<Input placeholder="请输入路径" />)}
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

    let tab;
    if(isEdit === false){
      tab = (     
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={coreData}
          columns={columns1}
          size="middle"
          pagination={paginationProps}
        />
      )
    }else{
      tab = (
        <Table
          rowKey="ruleId"
          pagination={false}
          loading={loading}
          dataSource={myData}
          columns={columns2}
          size="middle"
          pagination={paginationProps}
        />
      )
    }

    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            <Menu.Item key="1" onClick={this.leftSidebarToggle}>
              <Icon type="home" />
              待确认规则
            </Menu.Item>
            <Menu.Item key="2" onClick={this.leftSidebarToggle}>
              <Icon type="mail" />
              我的规则
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb style={{height: '36px',lineHeight: '25px'}}>
            <Breadcrumb.Item>规则中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          { tab }
        </Content>

        <Modal
          title={done ? null : `${isEdit ? '规则' : '规则'}确认`}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getAddForm()}
        </Modal>
      </Layout>
    );
  }
}

export default RuleCore;
