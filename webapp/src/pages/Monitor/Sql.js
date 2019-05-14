import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import request from '@/utils/request'
import { Table, Pagination, Tag } from 'antd'
import NumberInfo from '@/components/NumberInfo'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'dva';


class Sql extends PureComponent {

    state = {
        data: [],
        pagination: {},
        loading: false
    }

    columns() {
        return [
            {
                title: '最后一次执行时间',
                dataIndex: 'executeLastStartTime',
                key: 'executeLastStartTime',
                render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: '最大执行时长(纳秒)',
                dataIndex: 'executeSpanNanoMax',
                key: 'executeSpanNanoMax',
                render: val => (<span>
                  <NumberInfo
                      subTitle={val > 100000000 ? <Tag color="#f50">长</Tag> : undefined}
                      total={numeral(val).format('0,0')}
                      size="middle"
                    />
                                </span>),
                sorter: (a,b)=> (a.executeSpanNanoMax - b.executeSpanNanoMax),
                sortDirections:['descend','ascend']
            },
            {
                title: '总公共执行时长(纳秒)',
                dataIndex: 'executeSpanNanoTotal',
                key: 'executeSpanNanoTotal',

            },
            {
                title: '执行成功次数',
                dataIndex: 'executeSuccessCount',
                key: 'executeSuccessCount',

            },
            {
                title: 'sqlHash',
                dataIndex: 'sqlHash',
                key: 'sqlHash',
            }
        ]
    }

    getList = (page, pageSize) => {
        this.setState({
            loading: true
        })
        request(`/server/api/monitor/sql/lists?size=${pageSize}&current=${page}`).then(({ data }) => {
            const pagination = {
                defaultCurrent: data.current,
                total: data.total,
                onChange: this.getList
            }

            this.setState({
                data: data.records,
                pagination,
                loading: false
            })
        })
    }



    componentDidMount() {
        this.setState({
            loading: true
        })
        request('/server/api/monitor/sql/lists?size=5').then(({ data }) => {
            console.log(data);
            const pagination = {
                defaultCurrent: data.current,
                total: data.total,
                pageSize:data.size,
                onChange: this.getList
            }
            this.setState({
                data: data.records,
                pagination,
                loading: false
            })
        })

    }
    
    render() {
        const columns = this.columns();
        console.log(this.state);
        const { data, pagination, loading } = this.state


        return <PageHeaderWrapper title="SQL监控">
          <Table
              columns={columns}
              dataSource={data}
              pagination={pagination}
              loading={loading}
              rowKey="sqlHash"
              expandedRowRender={record => <p style={{ margin: 0 }}>{record.bSql}</p>}
            >
                
            </Table>
               </PageHeaderWrapper>
    }
}

export default Sql;