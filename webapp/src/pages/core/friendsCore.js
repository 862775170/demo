import React, { PureComponent } from 'react';
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
  TimePicker,
} from 'antd';
import moment from 'moment';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Option } = Select;

const columns = [
  {
    title: '文件名',
    dataIndex: 'name',
  },
  {
    title: '文件大小',
    dataIndex: 'size',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
];

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.models.profile,
}))
//好友中心
@Form.create()
class FriendsCore extends PureComponent {

  state = {
    operationkey: 'tab1',
    selectedRowKeys: [],
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  callback = (key) => {
    this.setState({
      operationkey: key,
    });
  };

  //收发时间段方法
  getTime = (time, timeString) => {
    console.log(time, timeString);
  }

  
  

  render() {
    const { loading, form: { getFieldDecorator }, } = this.props;
    const { operationkey, selectedRowKeys } = this.state;
    
    const dataValue = [
      {
        id: 1,
        name: '测试文件1',
        size: 10,
        status: "正常",
        updatedAt: '2019-1-12',
      },
      {
        id: 2,
        name: '测试文件2',
        size: 10,
        status: "正常",
        updatedAt: '2019-1-12',
      },
      {
        id: 3,
        name: '测试文件3',
        size: 10,
        status: "正常",
        updatedAt: '2019-1-12',
      }
    ];

    const renderAdvancedForm = () => {
      return (
        <Form onSubmit={this.handleSearch}>
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
    
    const rowSelection = {
      selectedRowKeys,
      //onChange: this.onSelectChange,
    };

    const contentList = {
      tab1: (
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          pagination={false}
          loading={loading}
          dataSource={dataValue}
          columns={columns}
          size="middle"
          pagination={paginationProps}
        />
      ),
      tab2: (
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          pagination={false}
          loading={loading}
          dataSource={dataValue}
          columns={columns}
          size="middle"
          pagination={paginationProps}
        />
      ),
      tab5: (
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          pagination={false}
          loading={loading}
          dataSource={dataValue}
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

    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            <Menu.Item key="1">
              <Icon type="mail" />
              数据中心
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="calendar" />
              运营中心
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="calendar" />
              销售交易部
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="calendar" />
              运营管理部
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="calendar" />
              人力资源部
            </Menu.Item>
            {/* <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu> */}
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>好友中心</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">数据中心</a></Breadcrumb.Item>
          </Breadcrumb>
          <Tabs defaultActiveKey="tab1" onChange={this.callback} style={{marginTop: '15px'}}>
            <TabPane tab="已发送" key="tab1">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="已收取" key="tab2">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="规则" key="tab3">
              规则
            </TabPane>
            <TabPane tab="任务" key="tab4">
              任务
            </TabPane>
            <TabPane tab="搜索" key="tab5">
              <div>{renderAdvancedForm()}</div>
              {contentList[operationkey]}
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
  }
}

export default FriendsCore;