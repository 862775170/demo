import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Cust.less';
import GroupBar from '@/components/Charts/GroupBar';
import Multiaxial from '@/components/Charts/Multiaxial';
import Annular from '@/components/Charts/Annular';

@connect(({ cust, loading }) => ({
  cust,
  loading: loading.effects['cust/getFincloudCust'],
  loading2: loading.effects['cust/getFincloudProduct'],
  loading3: loading.effects['cust/getCustProductAdd'],
}))
class Analysis extends Component {
  state = {
    selected: '0',
    addSelected: '0',
    timetype: '0',
  };

  componentDidMount() {
    this.onTypeChange('0'); 
    this.getFincloudProduct();
    this.getCustProductAdd('0', '0');
    this.getCustRegionAdd('0', '0');
    this.getOptions('0', '0');
  }

  getOptions = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'cust/getOptions',
      payload: {productId, timetype}
    });
  }

  getFincloudProduct = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'cust/getFincloudProduct',
    });
  }

  getCustProductAdd = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'cust/getCustProductAdd',
      payload: {productId, timetype}
    });
  }
  
  getCustRegionAdd = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'cust/getCustRegionAdd',
      payload: {productId, timetype}
    });
  }

  onTypeChange = (value) => {
    this.setState({
      selected: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'cust/getFincloudCust',
      payload: {id: value}
    });
  };

  onAddTypeChange = (value) => {
    this.setState({
      addSelected:  value,
    });
    const { timetype } = this.state;
    this.getCustProductAdd(value, timetype);
    this.getCustRegionAdd(value, timetype);
  };

  selectTimetype = timetype => {
    this.setState({
      timetype,
    });
    const { addSelected } = this.state;
    this.getCustProductAdd(addSelected, timetype);
    this.getCustRegionAdd(addSelected, timetype);
  };


  render() {
    const {  
      selected, 
      addSelected, 
      timetype,
      } = this.state;    

    const { cust, loading, loading2, loading3, } = this.props;
    const {
      fincloudCust: { groupBarData=[],  fields=[] },
      fincloudProduct=[],
      custProductAdd=[],
      custRegionAdd=[],
      options = [],
    } = cust;
    
    return (
      <GridContent>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <GroupBar 
                  fields={fields} // 展开字段集
                  boxTitle="客户区域分布情况" 
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
                  boxTitle="客户产品线分布情况" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading2}
                  data={fincloudProduct} 
                  x="product"
                  y="count"
                />
              </Suspense>
            </Col>
          </Row>
        </div>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Multiaxial 
                boxTitle="客户增长情况" 
                title1="各产品线客户增长情况"
                title2="各区域客户增长情况"
                loading={loading3}
                timetype={timetype}
                selectTimetype={this.selectTimetype}
                data={custProductAdd} 
                data2={custRegionAdd} 
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

export default Analysis;
