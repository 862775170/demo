import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
// import { getTimeDistance } from '@/utils/utils';
import styles from './Cust.less';
import GroupBar from '@/components/Charts/GroupBar';
import Multiaxial from '@/components/Charts/Multiaxial';
import Stacking from '@/components/Charts/Stacking';
import Annular from '@/components/Charts/Annular';

// const ProportionSales = React.lazy(() => import('../Dashboard/ProportionSales'));

@connect(({ custReport, loading }) => ({
  custReport,
  loading: loading.models.custReport,
}))
class Analysis extends Component {
  state = {

    selected: '0',
    options: [
      {id:'0',label:'总体'},
      {id:'1',label:'开发测试云'},
      {id:'2',label:'行情云'},
      {id:'3',label:'数据存管'},
      {id:'4',label:'基础资源外包服务'},
      {id:'5',label:'灾备服务'},
    ],
 

    selected2: '0',

    groupBarData2: [
      {
        name: "内部客户",
        "上海": 1,
        "北京": 1,
        "深圳": 2,
        "total": 4,
      },
      {
        name: "证券",
        "上海": 27,
        "北京": 26,
        "深圳": 53,
        "total": 4,
      },
      {
        name: "基金",
        "上海": 12,
        "北京": 17,
        "深圳": 19,
        "total": 4,
      },
      {
        name: "期货",
        "上海": 3,
        "北京": 3,
        "深圳": 4,
        "total": 4,
      },
      {
        name: "第三方销售",
        "上海": 8,
        "北京": 9,
        "深圳": 5,
        "total": 4,
      },
      {
        name: "资产管理公司",
        "上海": 2,
        "北京": 1,
        "深圳": 2,
        "total": 4,
      },
      {
        name: "证券关联机构",
        "上海": 1,
        "北京": 2,
        "深圳": 3,
        "total": 4,
      },
      {
        name: "其他金融机构",
        "上海": 1,
        "北京": 2,
        "深圳": 8,
        "total": 4,
      },
      
    ],
    fields2: ["上海", "北京", "深圳"],

    selected3: '0',

    groupBarData3: [
      {
        name: "内部客户",
        "上海": 1,
        "北京": 1,
        "深圳": 2,
        "total": 4,
      },
      {
        name: "证券",
        "上海": 27,
        "北京": 26,
        "深圳": 53,
        "total": 4,
      },
      {
        name: "基金",
        "上海": 12,
        "北京": 17,
        "深圳": 19,
        "total": 4,
      },
      {
        name: "期货",
        "上海": 3,
        "北京": 3,
        "深圳": 4,
        "total": 4,
      },
      {
        name: "第三方销售",
        "上海": 8,
        "北京": 9,
        "深圳": 5,
        "total": 4,
      },
      {
        name: "资产管理公司",
        "上海": 2,
        "北京": 1,
        "深圳": 2,
        "total": 4,
      },
      {
        name: "证券关联机构",
        "上海": 1,
        "北京": 2,
        "深圳": 3,
        "total": 4,
      },
      {
        name: "其他金融机构",
        "上海": 1,
        "北京": 2,
        "深圳": 8,
        "total": 4,
      },
      
    ],
    fields3: ["上海", "北京", "深圳"],
  };

  componentDidMount() {
    this.onTypeChange('0'); 
    this.getFincloudProduct();
  }

  getFincloudProduct = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'custReport/getFincloudProduct',
    });
    
  }

  onTypeChange = (value) => {
    this.setState({
      selected: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'custReport/getFincloudCust',
      payload: {id: value}
    });

  };

  render() {
    const {  selected, 
      options, 
      selected2, groupBarData2, fields2,
      selected3, groupBarData3, fields3
      } = this.state;    

    const { custReport, loading } = this.props;
    const {
      fincloudCust,
      fincloudProduct=[],
    } = custReport;
    const { groupBarData=[],  fields=[] } = fincloudCust;
    
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    return (
      <GridContent>
        <div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <GroupBar 
                  fields={fields} // 展开字段集
                  boxTitle="金融云客户分布" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading}
                  data={groupBarData} 
                  currentType={selected} 
                  typeOptions={options} 
                  onTypeChange={this.onTypeChange}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Annular
                  fields={fields} // 展开字段集
                  boxTitle="各产品线客户分布" 
                  // dropdownGroup={dropdownGroup}
                  loading={loading}
                  data={fincloudProduct} 
                />
              </Suspense>
            </Col>
          </Row>
        </div>
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Multiaxial 
                fields={fields2} // 展开字段集
                boxTitle="客户增长情况" 
                loading={loading}
                data={groupBarData2} 
                currentType={selected2} 
                typeOptions={options} 
                onTypeChange={this.onTypeChange}
              />
            </Suspense>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Analysis;
