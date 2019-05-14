import React, { Component } from 'react';
import { Row, Col, Card, Select } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Chart, Geom, Axis, Tooltip, Legend, } from "bizcharts";
import autoHeight from '../autoHeight';
import styles from '@/pages/Dashboard/Analysis.less';


const {Option} = Select;

@autoHeight()
class Multiaxial extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [],  autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  render() {
    const { 
      timetype, 
      selectTimetype,
      loading, 
      dropdownGroup, 
      data, 
      data2, 
      currentType, 
      addTypeOptions=[], 
      onAddTypeChange,
      boxTitle, 
      color,
      color2,
      title1,
      title2,
    } = this.props;


    
    return (
      <Card
        loading={loading}
        className={styles.salesCard}
        bordered={false}
        title={boxTitle}
        bodyStyle={{ padding: 24 }}
        extra={
          <div className={styles.salesCardExtra}>
            {dropdownGroup}
            <div className={styles.salesTypeRadio}>
              <Select
                style={{ width: 150 }}
                value={currentType}
                onChange={onAddTypeChange}
              >
                {addTypeOptions.map(item => <Option key={item.productId}>{item.productName}</Option>)}
              </Select>
              <div className={styles.salesExtra}>
                <a className={timetype==="2" ? styles.currentDate : ""} onClick={() => selectTimetype('2')}>
                  按周
                </a>
                <a className={timetype==="0" ? styles.currentDate : ""} onClick={() => selectTimetype('0')}>
                  按月
                </a>
                <a className={timetype==="1" ? styles.currentDate : ""} onClick={() => selectTimetype('1')}>
                  按季
                </a>
              </div>
            </div>
          </div>
        }
        style={{ marginTop: 24 }}
      >
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            {title1 && <h4 style={{ marginBottom: 10, textAlign: "center" }}>{title1}</h4>}
            <Chart height={300} forceFit data={data}>
              <Axis name="time" />
              <Axis name="count" />
              <Legend />
              <Tooltip
                crosshairs={{
                  type: "line"
                }}
              />
              <Geom type="areaStack" position="time*count" color={color} shape="smooth"  />
              <Geom type="lineStack" position="time*count" size={1} color={color} shape="smooth" />
            </Chart>
          </Col>

          <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{ marginTop: 20}}>
            {title2 && <h4 style={{ marginBottom: 10, textAlign: "center" }}>{title2}</h4>}
            <Chart height={300} forceFit data={data2}>
              <Axis name="time" />
              <Axis name="count" />
              <Legend />
              <Tooltip
                crosshairs={{
                  type: "line"
                }}
              />
              <Geom type="areaStack" position="time*count" color={color2} shape="smooth"  />
              <Geom type="lineStack" position="time*count" size={1} color={color2} shape="smooth" />
            </Chart>
          </Col>
        </Row>
        
      </Card>
      
    );
  }
}

export default Multiaxial;
