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
} from 'antd';

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
//任务中心
@Form.create()
class TaskCore extends PureComponent {

  state = {
    operationkey: 'tab1',
    rowSelection: [],
  };

  callback = (key) => {
    this.setState({
      operationkey: key,
    });
  };

  
  

  render() {
    const { loading, form: { getFieldDecorator }, } = this.props;
    const { operationkey, rowSelection } = this.state;
    
    const dataValue = [
      {
        name: '测试文件1',
        size: 10,
        status: "正常",
        updatedAt: '2019-1-12',
      },
      {
        name: '测试文件2',
        size: 10,
        status: "正常",
        updatedAt: '2019-1-12',
      },
      {
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
              <FormItem label="规则名称">
                {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
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
            </div>
          </div>
        </Form>
      );
    };

    const contentList = {
      tab1: (
        <Table
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
              当日发送
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="calendar" />
              当日发起
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="calendar" />
              已发送
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="calendar" />
              已收取
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>任务中心</Breadcrumb.Item>
            <Breadcrumb.Item><a href="">当日发送</a></Breadcrumb.Item>
          </Breadcrumb>
          <Tabs defaultActiveKey="tab1" onChange={this.callback} style={{marginTop: '15px'}}>
            <TabPane tab="全部" key="tab1">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="搜索" key="tab2">
              {contentList[operationkey]}
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
  }
}

export default TaskCore;
