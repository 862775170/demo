import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Cust.less';
import Multiaxial from '@/components/Charts/Multiaxial';
import Stacking from '@/components/Charts/Stacking';

@connect(({ order, loading }) => ({
  order,
  loading: loading.effects['order/getOrderTotal'],
  loading2: loading.effects['order/getOrderAdd'],
}))
class Order extends Component {
  state = {
    selected: '0',
    addSelected: '0',
    timetype: '0',
  };

  componentDidMount() {
    this.onTypeChange('0'); 
    this.getOrderAdd('0', '0');
    this.getOrderDel('0', '0');
    this.getOptions('0', '0');
    
  }

  getOptions = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getOptions',
      payload: {productId, timetype}
    });
  }

  getOrderAdd = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getOrderAdd',
      payload: {productId, timetype}
    });
  }
  
  getOrderDel = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getOrderDel',
      payload: {productId, timetype}
    });
  }

  onTypeChange = (value) => {
    this.setState({
      selected: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'order/getOrderTotal',
      payload: {id: value}
    });
  };

  onAddTypeChange = (value) => {
    this.setState({
      addSelected:  value,
    });
    const { timetype } = this.state;
    this.getOrderAdd(value, timetype);
    this.getOrderDel(value, timetype);
  };

  selectTimetype = timetype => {
    this.setState({
      timetype,
    });
    const { addSelected } = this.state;
    this.getOrderAdd(addSelected, timetype);
    this.getOrderDel(addSelected, timetype);
  };


  render() {
    const {  
      selected, 
      addSelected, 
      timetype,
      } = this.state;    

    const { order, loading, loading2, } = this.props;
    const {
      orderTotal: { orderTotalData=[],  fields=[] },
      orderAdd=[],
      orderDel=[],
      options = [],
    } = order;
    
    return (
      <GridContent>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Stacking 
                  fields={fields} // 展开字段集
                  boxTitle="产品线订单分布情况" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading}
                  data={orderTotalData} 
                  currentType={selected} 
                  typeOptions={options} 
                  onTypeChange={this.onTypeChange}
                />
              </Suspense>
            </Col>
          </Row>
        </div>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Multiaxial 
                boxTitle="订单新增情况" 
                title1="新增上线订单情况"
                title2="新增下线订单情况"
                loading={loading2}
                timetype={timetype}
                selectTimetype={this.selectTimetype}
                data={orderAdd} 
                data2={orderDel} 
                color="product"
                color2="product"
                currentType={addSelected} 
                addTypeOptions={options} 
                onAddTypeChange={this.onAddTypeChange}
              />
            </Suspense>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Order;
