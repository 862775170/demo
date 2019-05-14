import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Cust.less';
import Multiaxial from '@/components/Charts/Multiaxial';
import Stacking from '@/components/Charts/Stacking';
import Annular from '@/components/Charts/Annular';

@connect(({ contract, loading }) => ({
  contract,
  loading: loading.effects['contract/getPOCProductSum'],
  loading2: loading.effects['contract/getContractSum'],
  loading3: loading.effects['contract/getPocSum'],
}))
class Contract extends Component {
  state = {
    selected: '0',
    addSelected: '0',
    timetype: '0',
  };

  componentDidMount() {
    this.onTypeChange('0'); 
    this.getContractSum();
    this.getPocSum('0', '0');
    this.getPocAdd('0', '0');
    this.getOptions('0', '0');
    
  }

  getOptions = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/getOptions',
      payload: {productId, timetype}
    });
  }

  getContractSum = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/getContractSum',
    });
  }

  getPocSum = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/getPocSum',
      payload: {productId, timetype}
    });
  }
  
  getPocAdd = (productId, timetype)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/getPocAdd',
      payload: {productId, timetype}
    });
  }

  onTypeChange = (value) => {
    this.setState({
      selected: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/getPOCProductSum',
      payload: {id: value}
    });
  };

  onAddTypeChange = (value) => {
    this.setState({
      addSelected:  value,
    });
    const { timetype } = this.state;
    this.getPocSum(value, timetype);
    this.getPocAdd(value, timetype);
  };

  selectTimetype = timetype => {
    this.setState({
      timetype,
    });
    const { addSelected } = this.state;
    this.getPocSum(addSelected, timetype);
    this.getPocAdd(addSelected, timetype);
  };


  render() {
    const {  
      selected, 
      addSelected, 
      timetype,
      } = this.state;    

    const { contract, loading, loading2, loading3, } = this.props;
    const {
      POCProductSum: { POCProductSumData=[],  fields=[] },
      contractSum=[],
      pocSum=[],
      pocAdd=[],
      options = [],
    } = contract;
    
    return (
      <GridContent>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Stacking 
                  fields={fields} // 展开字段集
                  boxTitle="合同状态分布情况（含POC）" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading}
                  data={POCProductSumData} 
                  currentType={selected} 
                  typeOptions={options} 
                  onTypeChange={this.onTypeChange}
                />
              </Suspense>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Annular
                  // fields={fields} // 展开字段集
                  boxTitle="合同产品线分布情况" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading2}
                  data={contractSum} 
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
                boxTitle="合同签约情况" 
                title1="累计签约合同"
                title2="新增签约合同（含POC）"
                loading={loading3}
                timetype={timetype}
                selectTimetype={this.selectTimetype}
                data={pocSum} 
                data2={pocAdd} 
                color="showName"
                color2="contractType"
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

export default Contract;
