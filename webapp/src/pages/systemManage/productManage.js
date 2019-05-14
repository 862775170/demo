import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Table, Card } from 'antd';

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class ProductManage extends PureComponent {

  // state = {

  // };

  componentDidMount(){
    this.getProductList();          // 区域管理 列表接口
  }

  // 区域管理 列表接口
  getProductList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/productList',
    });
  };

  render() {
    const { loading, product:{ data } } = this.props;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '产品名称',
        dataIndex: 'productNameCh',
      },
      {
        title: '产品负责人',
        dataIndex: 'productManagerName',
      },
      {
        title: '产品描述',
        dataIndex: 'productDesc',
      },
      // {
      //   title: '操作',
      //   render: () => (// record
      //     <Fragment>
      //       <a href="">详情</a>
      //       <Divider type="vertical" style={{display:'none'}} />
      //     </Fragment>
      //   ),
      // },
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
      </PageHeaderWrapper>
    );
  }
}

export default ProductManage;

