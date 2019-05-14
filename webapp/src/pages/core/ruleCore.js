import React, { PureComponent, Fragment } from 'react';
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
  Input, 
  InputNumber, 
  Select,
  DatePicker,
  Card,
  Divider,
  Modal,
  TimePicker, 
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import moment from 'moment';

const { Description } = DescriptionList;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ core, loading }) => ({
  core,
  loading: loading.models.core,
}))
//规则中心
@Form.create()
class RuleCore extends PureComponent {

  state = {
    done: false,
    isEdit: false, 
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

  // 待确认规则 全部列表
  coreRuleTasks = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'core/getRuleTasks'
    });
  }

  //我的规则 全部列表 接口  
  coreRuleMyRule = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'core/getRuleMyRule'
    });
  }

  callback = (key) => {
    this.setState({
      operationkey: key,
    });
  };

  //左边栏切换
  leftSidebarToggle = (item) => {
    if(item.key === "1"){
      this.setState({
        isEdit: false,
      })
      this.coreRuleTasks();       // 待确认规则 列表
    }else{
      this.setState({
        isEdit: true,
        operationkey: 'tab1',
      })
      this.coreRuleMyRule();      //我的规则 全部列表 接口  
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
  showEditModal = item => { 
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
    const { operationkey, isEdit, done, visible } = this.state;

    //模态框 确定  取消按钮
    const modalFooter = done
      ? { footer: null, onCancel: this.handleCancel }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    
    const columns = [
      {
        title: '文件名',
        dataIndex: 'ruleName',
      },
      {
        title: '提交人',
        dataIndex: 'createBy',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record)}>确认</a>
            <Divider type="vertical" style={{display:'none'}}/>
          </Fragment>
        ),
      },
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
              //initialValue: current.userName,
            })(<Input placeholder="请输入路径" />)}
          </FormItem>
        </Form>
      );
    };

    const renderAdvancedForm = () => {
      return (
        <Form onSubmit={this.Search}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem {...this.formLayout} label="更新日期">
                {getFieldDecorator('date')(
                  <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...this.formLayout} label="收发时间段">
                {getFieldDecorator('number')(
                  <TimePicker onChange={this.getTime} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...this.formLayout} label="使用状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">关闭</Option>
                    <Option value="1">运行中</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem {...this.formLayout} label="更新日期">
                {getFieldDecorator('date')(
                  <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...this.formLayout} label="使用状态">
                {getFieldDecorator('status3')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">关闭</Option>
                    <Option value="1">运行中</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...this.formLayout} label="使用状态">
                {getFieldDecorator('status4')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">关闭</Option>
                    <Option value="1">运行中</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem {...this.formLayout} label="使用状态">
                {getFieldDecorator('status4')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">关闭</Option>
                    <Option value="1">运行中</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <span>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </Col>
          </Row>
        </Form>
      );
    };

    const contentList = {
      tab1: (
        <Table
          rowKey="ruleId"
          pagination={false}
          loading={loading}
          dataSource={myData}
          columns={columns}
          size="middle"
          pagination={paginationProps}
        />
      ),
      tab2: (
        <Table
          rowKey="ruleId"
          pagination={false}
          loading={loading}
          dataSource={myData}
          columns={columns}
          size="middle"
          pagination={paginationProps}
        />
      ),
      tab4: (
        <Table
          rowKey="ruleId"
          pagination={false}
          loading={loading}
          dataSource={myData}
          columns={columns}
          size="middle"
          pagination={paginationProps}
        />
      ),
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
        <Tabs defaultActiveKey="tab0" style={{marginTop: '15px'}}>
          <TabPane tab="全部" key="tab0">     
            <Table
              rowKey="id"
              pagination={false}
              loading={loading}
              dataSource={coreData}
              columns={columns}
              size="middle"
              pagination={paginationProps}
            />
          </TabPane>
        </Tabs>
      )
    }else{
      tab = (
        <Tabs defaultActiveKey="tab1" onChange={this.callback} style={{marginTop: '15px'}}> 
          <TabPane tab="全部" key="tab1">
            {contentList[operationkey]}
          </TabPane>
          <TabPane tab="接收规则" key="tab2">
            {contentList[operationkey]}
          </TabPane>
          <TabPane tab="发送规则" key="tab3">
            规则
          </TabPane>
          <TabPane tab="搜索" key="tab4">
            <div>{renderAdvancedForm()}</div>
            {contentList[operationkey]}
          </TabPane>
        </Tabs>  
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
              <Icon type="mail" />
              待确认规则
            </Menu.Item>
            <Menu.Item key="2" onClick={this.leftSidebarToggle}>
              <Icon type="calendar" />
              我的规则
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>规则中心</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">待确认规则</a></Breadcrumb.Item>
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
