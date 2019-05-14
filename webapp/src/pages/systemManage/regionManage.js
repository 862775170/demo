import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Table, Card, Badge, Divider, Modal } from 'antd';

@connect(({ region, loading }) => ({
  region,
  loading: loading.models.region,
}))
class RegionManage extends PureComponent {

  state = {
    done: false,
    isEdit: true,
    visible: false,
  };

  componentDidMount(){
    this.getRegionList();          // 区域管理 列表接口
  }

  // 区域管理 列表接口
  getRegionList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'region/regionList',
    });
  };

  // 点击详情  弹出  模态框
  showEditModal = () => { 
    this.setState({
      visible: true,
      isEdit: false,
    });
  };

  // 点击模态框中 保存按钮
  handleSubmit = e => {
    e.preventDefault();
    // const { form } = this.props;
    // const { isEdit } = this.state;
    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;
    //   if(isEdit){
    //     this.handleAdd(fieldsValue);
    //   }else{        
    //     this.handleUpdate(fieldsValue);
    //   }
    //   this.handleCancel();   // 调用关闭模态框方法
    // });
  };

  // 模态框 附属性
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { loading, region:{ data } } = this.props;
    const { done, isEdit, visible, } = this.state;

    // 模态框属性
    const modalFooter = done
      ? { footer: null, onCancel: this.handleCancel }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    // table列表
    const statusMap = ['default', 'success'];
    const status = ['失效', '生效'];
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '区域名称',
        dataIndex: 'regionName',
      },
      {
        title: '类别',
        dataIndex: 'resourceType',
      },
      {
        title: '数据中心',
        dataIndex: 'datacentId',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.datacentId - b.datacentId,
      },
      {
        title: '状态',
        dataIndex: 'regionStatus',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        render(val){
          return <Badge status={statusMap[val]} text={status[val]} />
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record)}>详情</a>
            <Divider type="vertical" style={{display:'none'}} />
          </Fragment>
        ),
      },
    ]
    
    // table组件属性
    const paginationProps4 = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };
    return (
      <PageHeaderWrapper>
        <Card>
          <Table 
            rowKey="id"
            dataSource={data} 
            loading={loading} 
            columns={columns} 
            size="middle"
            pagination={paginationProps4}
          />
        </Card>

        {/* 模态框 */}
        <Modal
          title={done ? null : `${isEdit ? '新建' : '修改'}用户`}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {/* {getAddForm()} */}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default RegionManage;

