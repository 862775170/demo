import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Table, Popconfirm, Divider, Tabs, Card, Alert, Avatar } from 'antd';
import styles from './Workplace.less';
import imgs from "../../assets/icons.png";

const {TabPane} = Tabs;

@connect(({ worker, loading }) => ({
  worker,
  loading: loading.models.worker,
}))
class Worker extends PureComponent {

  state = {
    count1: '',
    count2: '',
    count3: '',
    count4: '',
    metasklist: [],
    involvedTaskLists: [],
  };

  componentDidMount(){
    this.taskCount();             // 待办任务 总
    this.taskUntreatedCount();    // 待签收任务 总
    this.meTaskCount();           // 我的任务 总
    this.involvedTaskCount();     //  相关任务 总

    this.getTaskLists();          // 待办任务 列表接口
    this.fetchMore();             // 待签收任务 列表接口
    this.getMeTaskList();         // 我的任务列表
    this.getInvolvedTaskLists();  // 相关任务
  }

  // 待办任务 总
  taskCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/taskCount',
      callback: (result) => {      // result
        this.state.count1 = result.data;
      }
    })
  }

  // 待签收任务 总
  taskUntreatedCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/taskUntreatedCount',
      callback: (result) => {      
        this.state.count2 = result.data;
      }
    })
  }

  // 我的任务 总
  meTaskCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/meTaskCount',
      callback: (result) => {    
        this.state.count3 = result.data;
      }
    })
  }

  // 相关任务 总 
  involvedTaskCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/involvedTaskCount',
      callback: (result) => {    
        this.state.count4 = result.data;
      }
    })
  }

  // 待办任务 列表接口
  getTaskLists = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/getTaskList',
    });
  };

  // 待办任务 审批 & 拒绝 接口
  resetPassword = (item, boo) => {
    const { dispatch } = this.props;
    const {id} = item;
    const approved = boo;
    dispatch({
      type: 'worker/audit',
      payload: { id, approved },
      callback: () => {      // result
        this.taskCount();             // 待办任务 总
        this.involvedTaskCount();     //  相关任务 总

        this.getTaskLists();          // 待办任务 列表接口
        this.getInvolvedTaskLists();  // 相关任务
      }
    })
  }

  // 待签收任务 列表接口
  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/getTaskListByUntreated',
    });
  };

  // 待签收任务 签收接口
  workerTaskSingle = (item) => {
    const { dispatch } = this.props;
    const {id} = item;
    dispatch({
      type: 'worker/taskSingle',
      payload: { id },
      callback: () => {
        this.taskCount();             // 待办任务 总
        this.taskUntreatedCount();    // 待签收任务 总

        this.fetchMore();      // 待签收任务 列表接口
        this.getTaskLists();   // 待办任务 列表接口
      }
    })
  }

  // 我的任务列表
  getMeTaskList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/meTaskList',
      callback: (result) => {
        this.state.metasklist = result.data;
      }
    });
  };

  // 相关任务  
  getInvolvedTaskLists = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'worker/involvedTaskLists',
      callback: (result) => {
        this.state.involvedTaskLists = result.data;
      }
    });
  };

  render() {
    const { loading, worker:{ data }, worker:{dataTask} } = this.props;
    const { count1, count2, count3, count4, metasklist, involvedTaskLists } = this.state;

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src={imgs} />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            暂无相关描述
          </div>
          <div>
            敬请期待...
          </div>
        </div>
      </div>
    );

    const extraContents = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>待办任务</p>
          <p>{ count1 }</p>
        </div>
        <div className={styles.statItem}>
          <p>待签收任务</p>
          <p>{ count2 }</p>
        </div>
        <div className={styles.statItem}>
          <p>我的任务</p>
          <p>{ count3 }</p>
        </div>
        <div className={styles.statItem}>
          <p>相关任务</p>
          <p>{ count4 }</p>
        </div>
      </div>
    );

    // 待办任务
    const columns = [
      {
        title: '任务名称',
        dataIndex: 'name',
      },
      {
        title: '任务描述',
        dataIndex: 'description',
      },
      {
        title: '时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <Popconfirm title="是否确定同意?" onConfirm={() => this.resetPassword(record, true)}>
              <a href="">同意</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否确定拒绝?" onConfirm={() => this.resetPassword(record, false)}>
              <a href="">拒绝</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ]

    // 待签收任务
    const columns2 = [
      {
        title: '任务名称',
        dataIndex: 'name',
      },
      {
        title: '任务描述',
        dataIndex: 'description',
      },
      {
        title: '时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <Popconfirm title="是否要签收?" onConfirm={() => this.workerTaskSingle(record)}>
              <a href="">签收</a>
            </Popconfirm>
            <Divider type="vertical" style={{display:'none'}} />
          </Fragment>
        ),
      },
    ]

     // 我的任务
     const columns3 = [
      {
        title: '任务名称',
        dataIndex: 'processDefinitionName',
      },
      {
        title: '提交时间',
        dataIndex: 'startTime',
      },
    ]

    // table组件属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };
    // table组件属性
    const paginationProps2 = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };
    // table组件属性
    const paginationProps3 = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };
    // table组件属性
    const paginationProps4 = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };
    return (
      <PageHeaderWrapper
        content={pageHeaderContent}
        extraContent={extraContents}
      >
        <Card>
          <Tabs defaultActiveKey="1" size="large">
            <TabPane tab="待办任务" key="1">
              <Table 
                rowKey="id"
                dataSource={data} 
                loading={loading} 
                columns={columns} 
                size="middle"
                pagination={paginationProps}
              />
            </TabPane>
            <TabPane tab="待签收任务" key="2">
              <Alert message="签收完成后如需要同意操作，请进入待办任务中进行操作。" type="info" closable showIcon style={{marginBottom:"10px"}} />
              <Table 
                rowKey="id"
                dataSource={dataTask} 
                loading={loading} 
                columns={columns2} 
                size="middle"
                pagination={paginationProps2}
              />
            </TabPane>
            <TabPane tab="我的任务" key="3">
              <Table 
                rowKey="id"
                dataSource={metasklist} 
                loading={loading} 
                columns={columns3} 
                size="middle"
                pagination={paginationProps3}
              />
            </TabPane>
            <TabPane tab="相关任务" key="4">
              <Table 
                rowKey="id"
                dataSource={involvedTaskLists} 
                loading={loading} 
                columns={columns3} 
                size="middle"
                pagination={paginationProps4}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Worker;

