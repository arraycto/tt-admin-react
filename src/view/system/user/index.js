import React, { useState, useEffect, useRef } from 'react'

import { Button, Divider, Input, Table, Form, Modal, notification, Avatar, Tag, Radio, Select, Tooltip } from 'antd'
import { list, remove, add, update, resetPassword } from '@/api/system/user'
import { allList as roleAllList } from '@/api/system/role'
import moment from 'moment'
export default() => {
  const [tableData, setTableData] = useState([])
  const [roleData, setRoleData] = useState([])
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    fetch: false,
    deptId: 0,
    username: '',
    name: '',
    sex: null,
    status: null
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [formModalShow, setFormModalShow] = useState(false)
  const formInstance = useRef(null)
  const [formModalSubmitButtonLoading, setFormModalSubmitButtonLoading] = useState(false)
  useEffect(() => {
    getTableData()
    getRoleData()
  }, [])

  useEffect(() => {
    if (query.fetch) {
      getTableData()
    }
  }, [query])
  const getTableData = () => {
    setTableLoading(true)
    list(query).then(res => {
      setTableLoading(false)
      setTableData(res.data)
    }).catch(error => {
      console.error(error)
      setTableLoading(false)
    })
  }

  const getRoleData = () => {
    roleAllList().then(res => {
      setRoleData(res.data)
    }).catch(error => {
      console.error(error)
    })
  }

  const resetUserPassword = (id, username) => {
    resetPassword({ id, username, password: '123456' }).then(res => {
      notification.success({ message: '重置成功' })
    }).catch(error => {
      console.error(error)
    })
  }

  const save = (data) => {
    setFormModalSubmitButtonLoading(true)
    if (!data.id) {
      add({ ...data }).then(res => {
        setFormModalSubmitButtonLoading(false)
        notification.success({ message: '添加成功', duration: 3 })
        setFormModalShow(false)
        setQuery({ ...query, pageNum: 1, fetch: true })
      })
    } else {
      update({ ...data }).then(res => {
        setFormModalSubmitButtonLoading(false)
        notification.success({ message: '修改成功', duration: 3 })
        setFormModalShow(false)
        setQuery({ ...query, pageNum: 1, fetch: true })
      })
    }
  }
  const deleteData = (data) => {
    Modal.confirm({
      title: '删除',
      content: `确认删除${data.id} ?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        remove(data).then(res => {
          notification.success({ message: '删除成功', duration: 3 })
          setQuery({ ...query, fetch: true })
        })
      }
    })
  }

  const columns = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
      key: 'username',
      render: (value, record) => {
        return <div>
          <Avatar src={record.image} style={{ marginRight: 10 }} />
          <span style={{ display: 'inline-block', width: 100 }}>{value}</span>
        </div>
      }
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '邮箱',
      align: 'center',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'sex',
      key: 'sex',
      render: value => {
        return <Tag color={value === 1 ? 'lime' : 'gold'}>{value === 1 ? '男' : '女'}</Tag>
      }
    },
    {
      title: '出身日期',
      align: 'center',
      dataIndex: 'birth',
      key: 'birth',
      render: value => {
        return moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
      }
    },
    {
      title: '可用状态',
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      render: value => {
        return <Tag color={value === 1 ? 'lime' : 'gold'}>{value === 1 ? '可用' : '不可用'}</Tag>
      }
    },
    {
      title: '操作',
      align: 'center',
      width: '20%',
      render: (value, record) => {
        return <div>
          <Tooltip title='默认:123456' placement='top'>
            <Button type='primary' onClick={() => {
              resetUserPassword(record.id, record.username)
            }}>重置密码</Button>
          </Tooltip>

          <Divider type='vertical' />
          <Button type='primary' onClick={() => {
            setFormModalShow(true)
            formInstance.current.setFieldsValue({ ...record })
            console.log(record)
          }}>编辑</Button>
          <Divider type='vertical' />
          <Button type='danger' onClick={() => {
            deleteData(record)
          }}>删除</Button>
        </div>
      }
    }]
  const getFieldValue = key => {
    return formInstance.current && formInstance.current.getFieldValue(key)
  }
  const renderFormModal = () => {
    return <Modal
      title={getFieldValue('id') ? '修改' : '添加'}
      visible={formModalShow}
      forceRender
      okText={'提交'}
      cancelText={'取消'}
      footer={<div>
        <Button onClick={() => {
          setFormModalShow(false)
        }}>取消</Button>
        <Button loading={formModalSubmitButtonLoading} type='primary' onClick={() => {
          formInstance.current.validateFields()
            .then(values => {
              // 表单校验成功
              save(formInstance.current.getFieldValue())
            }).catch(e => {
              // 表单校验失败
              console.log(e)
            })
        }}>提交</Button>
      </div>}
      onCancel={() => {
        setFormModalShow(false)
      }}
    >
      <Form ref={formInstance} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
        <Form.Item label='用户名' name='username' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Input />
        </Form.Item>
        <Form.Item label='姓名' name='name' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Input />
        </Form.Item>
        <Form.Item label='性别' name='sex' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='状态' name='status' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Radio.Group>
            <Radio value={1}>可用</Radio>
            <Radio value={2}>不可用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='角色' name='roleId' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Select allowClear style={{ width: '100%' }} placeholder='角色'>
            {roleData.map(role => <Select.Option key={role.id} value={role.id}>{role.roleName}</Select.Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  }
  return <div className='sysUser-contain'>
    <div className='sysUser-contain-search' style={{ marginBottom: 10 }}>
      <Form name='horizontal_login' layout='inline'>
        <Form.Item>
          <Input value={query.username} onChange={e => { setQuery({ ...query, username: e.target.value, fetch: false }) }} placeholder='用户名' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item>
          <Input value={query.name} onChange={e => { setQuery({ ...query, name: e.target.value, fetch: false }) }} placeholder='姓名' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item>
          <Select value={query.sex} allowClear style={{ width: 150 }} onChange={value => { setQuery({ ...query, sex: value, fetch: false }) }} placeholder='性别'>
            <Select.Option value={1}>男</Select.Option>
            <Select.Option value={2}>女</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Select value={query.status} allowClear style={{ width: 150 }} onChange={value => { setQuery({ ...query, status: value, fetch: false }) }} placeholder='状态'>
            <Select.Option value={1}>可用</Select.Option>
            <Select.Option value={2}>不可用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item >
          <Button type='primary' onClick={() => { setQuery({ ...query, pageNum: 1, fetch: true }) }} >查询</Button>
        </Form.Item>
        <Form.Item >
          <Button type='primary' onClick={() => {
            formInstance.current.setFieldsValue({ id: null, parentId: 0 })
            setFormModalShow(true)
          }} >添加</Button>
        </Form.Item>
      </Form>
    </div>
    <div className='sysUser-contain-content'>
      <Table
        rowKey='id'
        loading={tableLoading}
        dataSource={tableData}
        columns={columns}
        pagination={{
          current: query.pageNum,
          pageSize: query.pageSize,
          total: query.total,
          showSizeChanger: false,
          onChange: page => {
            setQuery({ ...query, pageNum: page, fetch: true })
          }
        }} />
    </div>
    {renderFormModal()}
  </div>
}
