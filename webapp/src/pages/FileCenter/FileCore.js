import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Layout,
  Menu, 
  Breadcrumb, 
  Icon, 
  Table, 
  Form, 
  Divider,
  Button, 
  Col, 
  Row,   
  Select,
  Input, 
  DatePicker, 
} from 'antd';
import moment from 'moment';
import {getUserId} from '@/utils/authority'

const { RangePicker } = DatePicker;
const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ file, loading }) => ({
  file,
  loading: loading.models.file,
}))
// 文件中心
@Form.create()
class FileCore extends PureComponent {

  // 已发送
  columns1 = [
    {
      title: '规则名',
      dataIndex: 'ruleName',
    },
    {
      title: '接收人',
      dataIndex: 'targetUserName',
    },
    
    {
      title: '文件名',
      dataIndex: 'sourceFileName',
    },
    {
      title: '接收时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>, 
    },
  ]; 

  // 已收取
  columns2 = [
    {
      title: '规则名',
      dataIndex: 'ruleName',
    },
    {
      title: '发送人',
      dataIndex: 'sourceUserName',
    },
    {
      title: '源文件',
      dataIndex: 'sourceFileName',
    },
    {
      title: '保存文件名',
      dataIndex: 'targetFileName',
    },
    {
      title: '接收时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>, 
    }
  ]; 

  state = {
    userId: getUserId(),       // 获取登录用户的用户ID
    crumbs: '已发送',
    startKey: 'tab1',
    isTask: false,
    parameter:[],    // 查询条件参数
    friendsArr: [],  // 存储接收人数据
    sendoutArr: [],  // 存储已发送数据
    collectArr: [],  // 存储已收取数据
  };

  // 初始化方法
  componentDidMount() {
    this.coreExchageSendOut();       // 当日发送
    this.coreFriendsList();          // 接收人
    this.coreSendOutList();          //  已发送 规则
  }

  // 接收人
  coreFriendsList = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'file/getFriends',
      payload: { userId },
      callback: (result) => {
        this.state.friendsArr = result.data;   // 存储接收人数据
      } 
    });
  };

  //  已发送 规则
  coreSendOutList = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'file/getRuleMyRule',
      payload: { userId },
      callback: (result) => {
        this.state.sendoutArr = result.data;   // 存储已发送数据
      } 
    });
  };

  // 已收取 规则
  coreCollectList = () => {
    const { dispatch } = this.props;
    const { userId } = this.state;
    dispatch({
      type: 'file/getConfirmRule',
      payload: { userId },
      callback: (result) => {
        this.state.collectArr = result.data;   // 存储已收取数据
      } 
    });
  };

  // 左边栏切换
  leftSidebarToggle = (item) => {
    this.setState({
      crumbs: item.item.props.title,
      startKey: item.key,   // 状态  区分是 已发送  还是  已收取
    })
    this.handleFormReset();  // 重置
    switch(item.key){
      case "tab1": 
        this.coreSendOutList();          //  已发送 规则
        this.coreExchageSendOut();   // 已发送1
        this.setState({ isTask:false });
        break;
      default : 
        this.coreCollectList();          //  已收取 规则
        this.coreExchageSendIn();    // 已收取2
        this.setState({ isTask:true });
        break;
    }
  };

  // 查询方法
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { startKey } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.state.parameter = fieldsValue;
      switch(startKey){
        case "tab1": 
          this.coreSendOutList();          //  已发送 规则
          this.coreExchageSendOut();       // 已发送1
          this.setState({ isTask:false });
          break;
        default : 
          this.coreCollectList();          //  已收取 规则
          this.coreExchageSendIn();        // 已收取2
          this.setState({ isTask:true });
          break;
      }
    })
  };

  // 已发送
  coreExchageSendOut = () => {
    const { dispatch } = this.props;
    const { parameter } = this.state;   // 查询条件参数
    dispatch({
      type: 'file/getExchageSendOut',
      payload: {
        ...this.state,
        ...parameter,
        page: 1, 
        size: 10, 
      }
    });
  };

  handleTableChange1 = (pagination) => {
    const { dispatch } = this.props;
    const { parameter } = this.state;   // 查询条件参数
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
    };
    dispatch({
      type: 'file/getExchageSendOut',
      payload: {
        ...this.state,
        ...parameter,
        ...params,
      }
    });
  };

  // 已收取
  coreExchageSendIn = () => {
    const { dispatch } = this.props;
    const { parameter } = this.state;   // 查询条件参数
    dispatch({
      type: 'file/getExchageSendIn',
      payload: {
        ...this.state,
        ...parameter,
        page: 1, 
        size: 10, 
      }
    });
  };

  handleTableChange2 = (pagination) => {
    const { dispatch } = this.props;
    const { parameter } = this.state;   // 查询条件参数
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
    };
    dispatch({
      type: 'file/getExchageSendIn',
      payload: {
        ...this.state,
        ...parameter,
        ...params,
      }
    });
  };

  // 开始时间   ~     结束时间
  onChangeTime = (dates) => {
    if(dates.length > 0){
      this.setState({
        // eslint-disable-next-line no-underscore-dangle
        startTime: dates[0]._d.toGMTString(),      // 开始时间
        // eslint-disable-next-line no-underscore-dangle
        endTime: dates[1]._d.toGMTString(),        // 结束时间
      })
    }
  }

  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };


  render() {
    const { loading, form: { getFieldDecorator }, file: { dataList = {} } } = this.props;
    const { crumbs, isTask, friendsArr, sendoutArr, collectArr } = this.state;
    const { list = [], pagination } = dataList;

    // table组件属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
      ...pagination,
    };

    const renderAdvancedForm = () => {
      return (
        <Form onSubmit={this.handleSearch}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="文件名">
                {getFieldDecorator('sourceFileName')(
                  <Input placeholder="输入文件名" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              {/* <FormItem label="目标文件名">
                {getFieldDecorator('targetFileName')(
                  <Input placeholder="输入目标文件名" />
                )}
              </FormItem> */}
              {/* 发送规则 */}
              <FormItem label="规则名" style={{display: isTask ? 'none' : 'block'}}>
                {getFieldDecorator('sendout')(
                  <Select placeholder="请选择规则">
                    {
                      sendoutArr.map((item) => {
                        return <Option key={item.ruleId} value={item.ruleId}>{item.ruleName}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
              {/* 收取规则 */}
              <FormItem label="规则名" style={{display: isTask ? 'block' : 'none'}}>
                {getFieldDecorator('collect')(
                  <Select placeholder="请选择规则">
                    {
                      collectArr.map((item) => {
                        return <Option key={item.rule.ruleId} value={item.rule.ruleId}>{item.rule.ruleName}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="接收人">
                {getFieldDecorator('receiver')(
                  <Select placeholder="请选择">
                    {
                      friendsArr.map((item) => {
                        return <Option key={item.userId} value={item.userId}>{item.userName}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            
            {/* <Col md={8} sm={24}>
              
            </Col> */}
            <Col md={8} sm={24}>
              <FormItem label="时间">
                {getFieldDecorator('date')(
                  <RangePicker 
                    size="default" 
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }} 
                    onChange={this.onChangeTime} 
                  />
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

    return (
      <Layout style={{width: '100%',height:'91%',position: 'absolute',marginTop: '0px'}}>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['tab1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            <Menu.Item key="tab1" title="已发送" onClick={this.leftSidebarToggle} style={{marginTop: '0px'}}>
              <Icon type="calendar" />已发送
            </Menu.Item>
            <Menu.Item key="tab2" title="已收取" onClick={this.leftSidebarToggle} style={{marginTop: '0px'}}>
              <Icon type="calendar" />已收取
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb>
            <Breadcrumb.Item>收发记录</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{marginTop: '10px'}} />
          <div>{renderAdvancedForm()}</div>
          <Table
            rowKey="id"
            pagination={false}
            loading={loading}
            dataSource={list}
            columns={isTask ? this.columns2 : this.columns1}
            size="middle"
            // eslint-disable-next-line react/jsx-no-duplicate-props
            pagination={paginationProps}
            onChange={isTask ? this.handleTableChange2 : this.handleTableChange1}
          />
        </Content>
      </Layout>
    );
  }
}

export default FileCore;
