import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Menu, Breadcrumb, Icon, Table, Form, Divider } from 'antd';

const { Content, Sider } = Layout;

@connect(({ core, loading }) => ({
  core,
  loading: loading.models.core,
}))
// 任务中心
@Form.create()
class TaskCore extends PureComponent {

  state = {
    crumbs: '当日发送',
    operationkey: 'tab1',
  };

  // 左边栏切换
  leftSidebarToggle = (item) => {
    this.setState({
      operationkey: item.key,
      crumbs: item.item.props.title,
    })
  }

  render() {
    const { loading, core: { coreData } } = this.props;
    const { crumbs, operationkey } = this.state;
    
    // 当日发送
    const columns1 = [
      {
        title: '接收人',
        dataIndex: 'ruleName',
      },
      {
        title: '文件描述',
        dataIndex: 'createBy1',
      },
      {
        title: '文件路径',
        dataIndex: 'createBy',
      },
      {
        title: '文件名',
        dataIndex: 'createBy4',
      },
      {
        title: '发送时间',
        dataIndex: 'createBy115',
      },
      {
        title: '传输状态',
        dataIndex: 'createBy1005',
      }
    ]; 

    // 当日接收
    const columns2 = [
      {
        title: '发送人',
        dataIndex: 'ruleName',
      },
      {
        title: '文件描述',
        dataIndex: 'createBy1',
      },
      {
        title: '保存路径',
        dataIndex: 'createBy',
      },
      {
        title: '原文件名',
        dataIndex: 'createBy4',
      },
      {
        title: '保存文件名',
        dataIndex: 'createBy115',
      },
      {
        title: '接收时间',
        dataIndex: 'data',
      },
      {
        title: '传输状态',
        dataIndex: 'createBy1005',
      }
    ]; 

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
          dataSource={coreData}
          columns={columns1}
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
          dataSource={coreData}
          columns={columns2}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
      tab3: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={coreData}
          columns={columns1}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
      tab4: (
        <Table
          rowKey="id"
          pagination={false}
          loading={loading}
          dataSource={coreData}
          columns={columns2}
          size="middle"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          pagination={paginationProps}
        />
      ),
    };

    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['tab1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: '1px solid #e8e8e8' }}
          >
            <Menu.Item key="tab1" title="当日发送" onClick={this.leftSidebarToggle}>
              <Icon type="home" />当日发送
            </Menu.Item>
            <Menu.Item key="tab2" title="当日接收" onClick={this.leftSidebarToggle}>
              <Icon type="mail" />当日接收
            </Menu.Item>
            <Menu.Item key="tab3" title="已发送" onClick={this.leftSidebarToggle}>
              <Icon type="calendar" />已发送
            </Menu.Item>
            <Menu.Item key="tab4" title="已收取" onClick={this.leftSidebarToggle}>
              <Icon type="calendar" />已收取
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ background: '#fff', padding: '12px 24px 24px 24px', margin: 0, minHeight: 280, }}>
          <Breadcrumb style={{height: '36px',lineHeight: '25px'}}>
            <Breadcrumb.Item>任务中心</Breadcrumb.Item>
            <Breadcrumb.Item>{ crumbs }</Breadcrumb.Item>
          </Breadcrumb>
          <Divider style={{marginTop: '10px'}}/>
          { contentList[operationkey] }
        </Content>
      </Layout>
    );
  }
}

export default TaskCore;
