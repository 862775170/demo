import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Layout, 
  Breadcrumb, 
  Icon, 
  Table,
  Button, 
  Col, 
  Row, 
  Form,  
  Select,
  DatePicker,
  TimePicker,
  Divider,
  Card,
  PageHeader, 
} from 'antd';
import moment from 'moment';

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

// 规则
const columns = [
  {
    title: '发送方',
    dataIndex: 'sendUserName',
  },
  {
    title: '接收方',
    dataIndex: 'size',
  },
  {
    title: '规则描述',
    dataIndex: 'ruleName',
  },
  {
    title: '时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
];

@connect(({ search, loading }) => ({
  search,
  loading: loading.models.search,
}))
// 好友中心
@Form.create()
class SearchCore extends PureComponent {

  state = {
    userId: sessionStorage.getItem('userid'),       // 获取登录用户的用户ID
    
  };

  //初始化方法
  componentDidMount() {
    //this.coreFriendsList();       // 好友中心 好友列
  }

  // 收发时间段方法
  getTime = (time, timeString) => {
    console.log(time, timeString);
  }

  render() {
    const { 
      loading, 
      form: { getFieldDecorator }, 
    } = this.props;
    
    //table 假数据
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
              <FormItem label="规则名">
                {getFieldDecorator('date')(
                  <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="接收方">
                {getFieldDecorator('number')(
                  <TimePicker onChange={this.getTime} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="发送发">
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
              <FormItem label="发送时间">
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
    const routes = [
      {
        path: 'index',
        breadcrumbName: '搜索',
      }
    ];

    return (
      <PageHeader title="Title" breadcrumb={{ routes }}>
        <Card bordered={false}>
          {/* <Breadcrumb>
            <Breadcrumb.Item>搜索</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{marginTop: '10px'}}/> */}
          <div>{renderAdvancedForm()}</div>
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
        </Card>
      </PageHeader>
      // <Layout>
        
      //   <Content>
      //     <Breadcrumb>
      //       <Breadcrumb.Item>搜索</Breadcrumb.Item>
      //     </Breadcrumb>
      //     <Divider style={{marginTop: '10px'}}/>
      //     <div>{renderAdvancedForm()}</div>
      //     <Table
      //       rowKey="id"
      //       pagination={false}
      //       loading={loading}
      //       dataSource={dataValue}
      //       columns={columns}
      //       size="middle"
      //       // eslint-disable-next-line react/jsx-no-duplicate-props
      //       pagination={paginationProps}
      //     />
      //   </Content>
      // </Layout>
    );
  }
}

export default SearchCore;
