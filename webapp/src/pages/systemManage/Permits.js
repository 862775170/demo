import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable'
import request from '@/utils/request'
import { Table, Pagination, Tag, Card, Button, Form, Input, Select, Modal } from 'antd'
import NumberInfo from '@/components/NumberInfo'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'dva';
import { array } from 'prop-types';
// import { search } from '@/utils/listUtils'
import styles from '@/pages/systemManage/Permits.less'

const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;

@connect(({ permits, loading }) => (
    {
        permits,
        loading: loading.models.permits
    }
))
class Permits extends PureComponent {

    state = {
        done: false,
        isEdit: true,
        visible: false,

        selectedRows: [],

    }
    columns() {
        return [
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'permitsGroup',
                dataIndex: 'permitsGroup',
                key: 'permitsGroup',
                // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: 'permits',
                dataIndex: 'permits',
                key: 'permits'
            },
            {
                title: 'permitsName',
                dataIndex: 'permitsName',
                key: 'permitsName',

            }
        ]
    }

    getTableList() {
        this.props.dispatch({
            type: 'permits/getTableList',
            payload: {

            }
        })
    }

    componentDidMount() {
        this.getTableList()
    }
    //添加方法
    handleAddSubmit(form) {
        console.log(form);

    }
    //修改方法
    handleUpdateSubmit(form) {

    }

    setSearce(value) {
        this.props.dispatch({
            type: 'permits/searceTableList',
            payload: {
                serace: value.target.value
            }
        })
    }

    render() {
        const columns = this.columns();
        const { selectedRows, isEdit, visible, done } = this.state
        const { permits: { permitsList }, loading } = this.props


        return <PageHeaderWrapper title="接口权限标识配置">

            <Card bordered={false}>
                <div className={styles.tableList}>
                    {/* 添加按钮 */}
                    <div className={styles.tableListOperator} style={{ display: '-webkit-inline-box' }}>
                        <Button icon="plus" type="primary" onClick={() => console.log(1111)}>新建</Button>
                    </div>
                    {/* 搜索框 */}
                    <div className={styles.extraContent} style={{ display: '-webkit-inline-box', float: 'right' }}>
                        <Search onChange={value => this.setSearce(value)} onSearch={this.getUserList} className={styles.extraContentSearch} placeholder="请输入" />
                    </div>
                    <StandardTable
                        rowKey='id'
                        selectedRows={selectedRows}
                        loading={loading}
                        data={permitsList}
                        columns={columns}
                        onSelectRow={(row) => this.setState({ selectedRows: row })}
                        size="middle"
                    />

                </div>
            </Card>

        </PageHeaderWrapper>
    }
}

export default Permits;