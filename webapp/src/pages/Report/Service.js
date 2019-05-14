import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Cust.less';
import GroupBar from '@/components/Charts/GroupBar';
import Multiaxial from '@/components/Charts/Multiaxial';
import Annular from '@/components/Charts/Annular';

@connect(({ service, loading }) => ({
  service,
  loading: loading.effects['service/getFincloudCust'],
  loading2: loading.effects['service/getServiceProduct'],
  loading3: loading.effects['service/getServiceProductAdd'],
}))
class Service extends Component {
  state = {
    selected: '0',
    addSelected: '0',
    timetype: '0',
  };

  componentDidMount() {
    this.onTypeChange('0'); 
    this.getServiceProduct();
    this.getServiceProductAdd('0', '0');
    this.getServiceRegionAdd('0', '0');
    this.getOptions('0', '0');
  }

  getOptions = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'service/getOptions',
      payload: {productId, timetype}
    });
  }

  getServiceProduct = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'service/getServiceProduct',
    });
  }

  getServiceProductAdd = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'service/getServiceProductAdd',
      payload: {productId, timetype}
    });
  }
  
  getServiceRegionAdd = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'service/getServiceRegionAdd',
      payload: {productId, timetype}
    });
  }

  onTypeChange = (value) => {
    this.setState({
      selected: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'service/getCustService',
      payload: {id: value}
    });
  };

  onAddTypeChange = (value) => {
    this.setState({
      addSelected:  value,
    });
    const { timetype } = this.state;
    this.getServiceProductAdd(value, timetype);
    this.getServiceRegionAdd(value, timetype);
  };

  selectTimetype = timetype => {
    this.setState({
      timetype,
    });
    const { addSelected } = this.state;
    this.getServiceProductAdd(addSelected, timetype);
    this.getServiceRegionAdd(addSelected, timetype);
  };


  render() {
    const {  
      selected, 
      addSelected, 
      timetype,
      } = this.state;    

    const { service, loading, loading2, loading3, } = this.props;
    const {
      custService: { groupBarData=[],  fields=[] },
      serviceProduct=[],
      serviceProductAdd=[],
      serviceRegionAdd=[],
      options = [],
    } = service;
    
    return (
      <GridContent>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <GroupBar 
                  fields={fields} // 展开字段集
                  boxTitle="金融云服务开通客户分布" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading}
                  data={groupBarData} 
                  currentType={selected} 
                  typeOptions={options} 
                  onTypeChange={this.onTypeChange}
                />
              </Suspense>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Annular
                  boxTitle="金融云服务开通产品线分布" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading2}
                  data={serviceProduct} 
                  x="productNameCh"
                  y="sum"
                />
              </Suspense>
            </Col>
          </Row>
        </div>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Multiaxial 
                boxTitle="金融云服务开通增长情况" 
                title1="金融云各产品线服务开通增长情况"
                title2="金融云各地区服务开通增长情况"
                loading={loading3}
                timetype={timetype}
                selectTimetype={this.selectTimetype}
                data={serviceProductAdd} 
                data2={serviceRegionAdd} 
                color="showName"
                color2="companyAbbr"
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

export default Service;
