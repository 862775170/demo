import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Form, Card, Divider, Tag, Typography, Button, Input, Drawer, Row, Col, Transfer, Badge, Radio } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './roleManage.less';

const { Text } = Typography
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const statusMap = ['default', 'success'];
const status = ['失效', '生效'];

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class RoleManageList extends PureComponent {
  state = {
    isEdit: false,
    done: false,
    visible: false,
    roleList: [],
    mockData: [],
    targetKeys: [],
    roleStatus: 1,
  };

  // 初始化角色管理方法
  componentDidMount() {
    this.getRoleList();       // 角色管理 列表接口
    this.getPermitsLists();   // 穿梭框查询数据接口
  }

  // 角色管理 列表接口
  getRoleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/roleList'
    });
  }

  // 点击保存按钮
  handleSubmit = () => {
    const { form } = this.props;
    const { isEdit } = this.state;
    const { targetKeys } = this.state;
    form.validateFields((err, fieldsValue) => {
      if(targetKeys.length === 0){
        if (err) return;
      }
      if(isEdit){
        this.postRoleAdd(fieldsValue);
      }else{
        this.handleUpdate(fieldsValue, targetKeys);
      }
    }); 
  };

  // 点击新建  弹出  抽屉
  showModal = () => {
    this.setState({
      visible: true,
      isEdit: true,
      current: {},
      roleStatus: 1,
    });
    this.getMock(); // 处理穿梭框数据格式
  };

  // 点击修改  弹出  抽屉
  showEditModal = item => {
    let stat;
    if(item.roleStatus === '0'){
      stat = 0;
    }else{
      stat = 1;
    }
    this.setState({
      visible: true,
      current: item,
      isEdit: false,
      roleStatus: stat,
    });
    const ids = item.permits.map(p => p.id);
    this.getMock(ids); // 处理穿梭框数据格式
  }

  // 穿梭框查询数据接口
  getPermitsLists = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/permitsList',
      callback: (result) => {
        this.state.roleList = result.data;
      }
    })
  }

  // 新建
  postRoleAdd = fieldsValue => {
    const { dispatch } = this.props;
    const roleOwner = 'SSCC';
    const { roleStatus } = this.state;
    dispatch({
      type: 'role/roleAdd',
      payload: { roleStatus, roleOwner, ...fieldsValue },
      callback: () => {
        this.onClose();        // 调用关闭抽屉属性
        this.getRoleList();    // 角色管理 列表接口
      }
    })
  }

  // 获取状态数据
  onChangeRadio = (e) => {
    this.setState({
      roleStatus: e.target.value,
    })
  }

  // 修改
  handleUpdate = (item, key) => {
    const { dispatch } = this.props;
    const { current } = this.state;
    const { roleId } = current; // 角色ID
    const { roleName } = item;   // 角色名称
    const { roleType } = item;   // 角色编码
    const { roleStatus } = item; // 角色状态
    const roleOwner = 'SSCC';
    let prermits = [];
    if(!item.prermits){
      const { targetKeys } = this.state;
      prermits = targetKeys;    // 默认功能
    }else{
      prermits = key;    // 手动添加功能  
    }
    dispatch({
      type: 'role/roleUpdate',
      payload: { roleId, roleName, roleType, roleStatus, roleOwner, prermits },
      callback: () => {
        this.onClose();        // 调用关闭抽屉属性
        this.getRoleList();    // 角色管理 列表接口
      }
    })
  }

  // 处理穿梭框数据格式
  getMock = (id) => {
    const mockData = [];
    const { roleList } = this.state;
    roleList.forEach((value, key) => {
      const data = {
        key,
        title: value.permitsName,
      };
      mockData.push(data);   // 左边穿梭框值
    })
    this.setState({ mockData,targetKeys:id });
  }

  // 抽屉属性 关闭
  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  // 穿梭框
  handleChange = (targetKeys) => {
    this.setState({
      targetKeys
    });
  }

  // 穿梭框搜索
  handleSearch = (dir, value) => {
    console.log(`search...${dir}`, value);
  }

  render() {
    const { role: { roleData }, loading, form: { getFieldDecorator } } = this.props;
    const { isEdit, done, visible, current={}, mockData=[], targetKeys=[], roleStatus } = this.state;

    const RoleDetali = (
      props => <div style={{ margin:0 }}><Text>{props.group}</Text><br /><div style={{ marginBottom:'10px' }}>{props.names.map(name =><Tag color="blue" key={name}>{name}</Tag>)}</div></div>
    )

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '角色编码',
        dataIndex: 'roleType',
      },
      {
        title: '状态',
        dataIndex: 'roleStatus',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        render(val){
          return <Badge status={statusMap[val]} text={status[val]} />
        }
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record)}>修改</a>
            <Divider type="vertical" style={{display:'none'}} />
            {/* <a href="">删除</a> */}
          </Fragment>
        ),
      },
    ]

    const roleDetalis = (render) => {
      const result = new Map();
      render.permits.forEach(t => {
        if (!result.has(t.permitsGroup)) {
          result.set(t.permitsGroup, [])
        }
        if (t.permitsName) {
          result.get(t.permitsGroup).push(t.permitsName)
        }
      });
      const comp = []
      let i = 0
      result.forEach((value, key) => {
        comp.push(<RoleDetali key={i+=1} group={key} names={value} />)
      })
      return comp;
    };

    const getAddForm = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="角色名称">
                {getFieldDecorator('roleName', {
                  rules: [{ 
                    required: true, 
                    message: '由字母或中文组成，长度为3-12', 
                    pattern: /^[a-zA-Z\u4e00-\u9fa5]{3,12}$/
                  }],
                  initialValue: current.roleName,
                })(<Input placeholder="请输入角色名称" />)}
              </FormItem>
            </Col>  
            <Col span={12}> 
              <FormItem label="角色编码">
                {getFieldDecorator('roleType', {
                rules: [{ 
                  required: true,
                  message: '由字母组成，长度为3-12', 
                  pattern: /^[a-zA-Z]{3,12}$/
                }],
                initialValue: current.roleType,
              })(<Input placeholder="请输入角色编码" />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="状态">
                {getFieldDecorator('roleStatus', {
                  rules: [{ 
                    required: true,
                  }],
                  initialValue: roleStatus,
                })(
                  <RadioGroup onChange={this.onChangeRadio}>
                    <Radio value={1}>生效</Radio>
                    <Radio value={0}>失效</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label="功能">
                {getFieldDecorator('prermits', {
                  rules: [{
                    required: true, 
                    message: '请选择功能!'
                  }],
                })(
                  <Transfer 
                    dataSource={mockData}
                    titles={['来源','目标']}
                    showSearch
                    targetKeys={targetKeys}
                    onChange={this.handleChange}
                    onSearch={this.handleSearch}
                    render={item => item.title}
                    listStyle={{width:220, height: 300}}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    };

    // table组件属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `总数 ${total} 条`,
    };

    return (
      <PageHeaderWrapper id="menu.system.roleManage" title="角色管理">
        <div className={styles.filterCardList}>
          <Card bordered={false} style={{ marginTop: 24 }}>
            <div className={styles.tableList}>
              {/* 添加按钮 */}
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.showModal()}>新建</Button>
              </div>
              <Divider />
              <Table 
                rowKey="roleId"
                dataSource={roleData} 
                loading={loading} 
                columns={columns} 
                size="middle"
                pagination={paginationProps}
                expandedRowRender={roleDetalis}
              />
            </div>
          </Card>
          {/* 抽屉组件 */}
          <Drawer
            title={done ? null : `${isEdit ? '新建' : '修改'}角色`}
            placement="right"
            onClose={this.onClose}
            visible={visible}
            destroyOnClose
            width={720}
          >
            { getAddForm() }

            <div 
              style={{
                position:'absolute', 
                left:0,
                bottom:0,
                width: '100%',
                borderTop:'1px solid #e9e9e9',
                padding:'10px 16px',
                background:'#fff',
                textAlign:'left',
              }}
            >
              <Button onClick={this.onClose} style={{marginRight:8}}>取消</Button>
              <Button onClick={this.handleSubmit} type="primary">保存</Button>
            </div>
          </Drawer>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default RoleManageList;
