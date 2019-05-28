import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Icon, Table, Form, Divider } from 'antd';

const { Content, Sider } = Layout;

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
      title: '接收人',
      dataIndex: 'targetUserName',
    },
    {
      title: '文件规则',
      dataIndex: 'ruleName',
    },
    {
      title: '文件名',
      dataIndex: 'sourceFileName',
    },
    {
      title: '接收时间',
      dataIndex: 'time',
    },
  ]; 

  // 已收取
  columns2 = [
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
      title: '发送时间',
      dataIndex: 'time',
    },
    {
      title: '文件描述',
      dataIndex: 'ruleName',
    }
  ]; 

  state = {
    userId: sessionStorage.getItem('userid'),       // 获取登录用户的用户ID
    crumbs: '当日发送',
    isTask: false,
  };

  // 左边栏切换
  // eslint-disable-next-line react/sort-comp
  leftSidebarToggle = (item) => {
    this.setState({
      crumbs: item.item.props.title,
    })
    const { userId } = this.state;
    switch(item.key){
      case "tab1": 
        this.coreExchageSendOut(userId);   // 已发送1
        this.setState({ isTask:false });
        break;
      default : 
        this.coreExchageSendIn(userId);    // 已收取2
        this.setState({ isTask:true });
        break;
    }
  };

  // 初始化方法
  componentDidMount() {
    const { userId } = this.state;
    this.coreExchageSendOut(userId);       // 当日发送
  }

  // 已发送
  coreExchageSendOut = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'file/getExchageSendOut',
      payload: {
        userId: id,
      }
    });
  };

  // 已收取
  coreExchageSendIn = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'file/getExchageSendIn',
      payload: {
        userId: id,
      }
    });
  };


  render() {
    const { loading, file: { dataList } } = this.props;
    const { crumbs, isTask } = this.state;

    // table组件属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };

    return (
      <Layout style={{width: '100%',height:'90%',position: 'absolute',marginTop: '0px'}}>
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
            <Breadcrumb.Item>文件中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{marginTop: '10px'}} />
          <Table
            rowKey="id"
            pagination={false}
            loading={loading}
            dataSource={dataList}
            columns={isTask ? this.columns2 : this.columns1}
            size="middle"
            // eslint-disable-next-line react/jsx-no-duplicate-props
            pagination={paginationProps}
          />
        </Content>
      </Layout>
    );
  }
}

export default FileCore;
