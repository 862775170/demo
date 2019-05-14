import React, { Component } from 'react';
import { Card, Select } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Chart, Geom, Axis, Tooltip, Legend, } from "bizcharts";
import DataSet from "@antv/data-set";
import autoHeight from '../autoHeight';
import styles from '@/pages/Dashboard/Analysis.less';

const {Option} = Select;

@autoHeight()
class GroupBar extends Component {
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
    const { data = [], autoLabel = true } = this.props;
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
    const { loading, dropdownGroup, data, currentType, typeOptions=[], onTypeChange, boxTitle, fields } = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields,
      // 展开字段集
      key: "key",
      // key字段
      value: "value" // value字段
    });
    
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
                onChange={onTypeChange}
              >
                {typeOptions.map(item => <Option key={item.productId}>{item.productName}</Option>)}
              </Select>
            </div>
          </div>
        }
        style={{ marginTop: 24 }}
      >
        <Chart height={400} data={dv} forceFit>
          <Axis name="key" />
          <Axis name="value" />
          <Legend />
          <Tooltip
            crosshairs={{
            type: "y"
          }}
          />
          <Geom
            type="interval"
            position="key*value"
            color="name"
            adjust={[
            {
              type: "dodge",
              marginRatio: 1 / 10
            }
          ]}
          />
        </Chart>
      </Card>
      
    );
  }
}

export default GroupBar;
