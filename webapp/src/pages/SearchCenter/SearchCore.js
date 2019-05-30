import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Breadcrumb,
  Table,
  Button, 
  Col, 
  Row, 
  Form,  
  Select,
  DatePicker,
  Divider,
  Card,
  PageHeader,
  Input, 
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

// 搜索
const columns = [
  {
    title: '发送方',
    dataIndex: 'createTime',
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
// 搜索
@Form.create()
class SearchCore extends PureComponent {

  state = {
    // userId: sessionStorage.getItem('userid'),       // 获取登录用户的用户ID
    sourceFileName: '',
    sourceUserId: '', 
    targetUserId: '', 
    targetFileName: '', 
    startTime: '', 
    endTime: '',
  };

  // 初始化方法
  componentDidMount() {
    this.getSearchList();
  }

  // 列表方法
  getSearchList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'search/getFileExchageSearch',
      payload: {
        ...this.state,
        page: 1, 
        size: 10, 
      }
    });
  }

  render() {
    const { loading, form: { getFieldDecorator }, search: { searchData } } = this.props;
    const { list = [], pagination } = searchData;

    const renderAdvancedForm = () => {
      return (
        <Form onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="规则名">
                {getFieldDecorator('date')(
                  <Input placeholder="输入规则名" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="接收方">
                {getFieldDecorator('date')(
                  <Input placeholder="接收方" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="发送发">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择">
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
            <Col md={8} sm={24} style={{height: '79px',paddingTop: '45px'}}>
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
      ...pagination,
    };

    return (
      <PageHeader>
        <Card bordered={false} style={{marginTop: '-28px'}}>
          <Breadcrumb>
            <Breadcrumb.Item>搜索</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{height:'1px',left: '-13px'}} />
          <div>{renderAdvancedForm()}</div>
          <Table
            rowKey="id"
            pagination={false}
            loading={loading}
            dataSource={list}
            columns={columns}
            size="middle"
            // eslint-disable-next-line react/jsx-no-duplicate-props
            pagination={paginationProps}
          />
        </Card>
      </PageHeader>
    );
  }
}

export default SearchCore;
