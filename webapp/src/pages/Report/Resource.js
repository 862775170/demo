import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Table,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Resource.less';


const { Search } = Input;
@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
@Form.create()
class Resource extends PureComponent {
  state = {
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  
  
  columns = [
    {
      title: '产品/区域',
      dataIndex: 'displayName',
      width: 200,
      // textWrap: 'word-break'
    },
    {
      title: '互联网IP（个）',
      dataIndex: 'ip',
      align: "right",  
      render: text => <span>{text.toLocaleString()}</span>,  
    },
    {
      title: '互联网带宽（M）',
      dataIndex: 'band',      
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>,     
    },
    {
      title: '物理主机（台）',
      dataIndex: 'host',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '云主机（台）',
      dataIndex: 'vm',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '云硬盘（G）',
      dataIndex: 'ceph',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '专业存储（G）',
      dataIndex: 'storage',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '专线（个）',
      dataIndex: 'line',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '核心机构（个）',
      dataIndex: 'org',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: 'VPN（个）',
      dataIndex: 'vpn',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '混合云空间（4U）',
      dataIndex: 'cabinet',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '呼叫中心网关（个）',
      dataIndex: 'call',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '坐席（个）',
      dataIndex: 'seat',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
  ];

  columns2 = [
    {
      title: '产品/区域',
      dataIndex: 'displayName',
    },
    {
      title: '互联网IP（个）',
      dataIndex: 'ip',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '互联网带宽（M）',
      dataIndex: 'band',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '物理主机（台）',
      dataIndex: 'host',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '云主机（台）',
      dataIndex: 'vm',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: '云硬盘（G）',
      dataIndex: 'ceph',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
    {
      title: 'VPN（个）',
      dataIndex: 'vpn',
      align: "right",
      render: text => <span>{text.toLocaleString()}</span>, 
    },
  ];

  componentDidMount() {
    this.updatedTableData();
  }

  // 更新表格数据
  updatedTableData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/getResourceUsing',
    });
    dispatch({
      type: 'resource/getResourceTerminate',
    });
  };

  render() {
    const {
      resource: { usingData, terminateData },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title="资源管理报表">
        <Card title="在用资源" bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}>
              <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
            </div> */}
            <Table
              loading={loading}
              dataSource={usingData}
              columns={this.columns}
              pagination={false}
              size="middle"
            />
          </div>
        </Card>
        <Card title="已下线资源" bordered={false} style={{marginTop: '10px'}}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}>
              <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
            </div> */}
            <Table
              loading={loading}
              dataSource={terminateData}
              columns={this.columns2}
              pagination={false}
              size="middle"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Resource;
