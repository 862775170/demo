import React, { Component } from 'react';
import { Card,  } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Label, } from "bizcharts";
import DataSet from "@antv/data-set";
import autoHeight from '../autoHeight';
import styles from '@/pages/Dashboard/Analysis.less';

@autoHeight()
class Annular extends Component {
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

    const { loading, data, boxTitle, x, y } = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: x,
      field: y,
      dimension: y,
    });
    
    return (
      <Card
        loading={loading}
        className={styles.salesCard}
        bordered={false}
        title={boxTitle}
        bodyStyle={{ padding: 24 }}
        style={{ marginTop: 24 }}
      >

        <Chart
          height={400}
          data={dv}
          forceFit
        >
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend
            position="bottom"
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Geom
            type="intervalStack"
            position={y}
            color={x}
            tooltip={[
              `${x}*${y}`,
              (product, count) => {
                return {
                  name: product,
                  value: count
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content={y}
              formatter={(count, z) => {
                return `${z.point[x]  }: ${  count}`;
              }}
            />
          </Geom>
        </Chart>
      
      </Card>
      
    );
  }
}

export default Annular;
