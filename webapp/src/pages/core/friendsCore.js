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
  Select,
  DatePicker,
  TimePicker,
  Divider,
} from 'antd';
import moment from 'moment';

const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

const columns = [
  {
    title: '发送方',
    dataIndex: 'userId',
  },
  {
    title: '接收方',
    dataIndex: 'size',
  },
  {
    title: '规则描述',
    dataIndex: 'status',
  },
  {
    title: '时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
];

@connect(({ friends, loading }) => ({
  friends,
  loading: loading.models.friends,
}))
// 好友中心
@Form.create()
class FriendsCore extends PureComponent {

  state = {
    userId: sessionStorage.getItem('userid'),
    friendsArr: [],
    operationkey: 'tab1',
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  //初始化方法
  componentDidMount() {
    this.coreFriendsList();       // 好友中心 好友列
  }

  // 好友中心 好友列
  coreFriendsList = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'friends/getFriends',
      payload: { userId },
      callback: (result) => {
        this.state.friendsArr = result.data;
      } 
    });
  }

  callback = (key) => {
    this.setState({
      operationkey: key,
    });
  };

  // 收发时间段方法
  getTime = (time, timeString) => {
    console.log(time, timeString);
  }

  
  

  render() {
    const { loading, form: { getFieldDecorator } } = this.props;
    const { operationkey, friendsArr } = this.state;
    
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
          dataSource={dataValue}
          columns={columns}
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
          dataSource={dataValue}
          columns={columns}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
      tab5: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={dataValue}
          columns={columns}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
    };

    return (
      <Layout style={{width: '100%',height:'92%',position: 'absolute',marginTop: '2px'}}>
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['admin']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            {
              friendsArr.map((item) => {
                return <Menu.Item key={item.userId}>
                <Icon type="user" />{item.userName}
              </Menu.Item>
              })
            }
          </Menu>
        </Sider>
        
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>好友中心</Breadcrumb.Item>
            <Breadcrumb.Item>数据中心</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{marginTop: '10px'}}/>
          <Tabs defaultActiveKey="tab1" onChange={this.callback} style={{marginTop: '15px'}}>
            <TabPane tab="规则" key="tab1">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="已发送" key="tab2">
              {contentList[operationkey]}
            </TabPane>
            <TabPane tab="已收取" key="tab3">
              {contentList[operationkey]}
            </TabPane>
            {/* <TabPane tab="任务" key="tab4">
              任务
            </TabPane> */}
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
