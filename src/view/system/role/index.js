import React, { useState, useEffect, useRef } from 'react'

import { Button, Divider, Input, Table, Form, Modal, notification } from 'antd'
import PermissionModal from './permission'
import { list, remove, add, update } from '@/api/system/role'

export default() => {
  const [tableData, setTableData] = useState([])
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    fetch: false,
    roleName: '',
    roleSign: '',
    remark: ''
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [formModalShow, setFormModalShow] = useState(false)
  const [permissionModalShow, setPermissionModalShow] = useState(false)
  const [permissionRoleId, setPermissionRoleId] = useState(null)
  const formInstance = useRef(null)
  const [formModalSubmitButtonLoading, setFormModalSubmitButtonLoading] = useState(false)
  useEffect(() => {
    getTableData()
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
      title: '角色名称',
      align: 'center',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '角色标识',
      align: 'center',
      dataIndex: 'roleSign',
      key: 'roleSign'
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'updateTime',
      key: 'updateTime'
    },
    {
      title: '操作',
      align: 'center',
      width: '20%',
      render: (value, record) => {
        return <div>
          <Button type='primary' onClick={() => {
            setPermissionRoleId(record.id)
            setPermissionModalShow(true)
          }}>权限</Button>
          <Divider type='vertical' />
          <Button type='primary' onClick={() => {
            setFormModalShow(true)
            formInstance.current.setFieldsValue({ ...record })
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
        <Form.Item label='角色名称' name='roleName' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Input />
        </Form.Item>
        <Form.Item label='角色标识' name='roleSign' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Input />
        </Form.Item>
        <Form.Item label='备注' name='remark' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  }
  return <div className='sysRole-contain'>
    <div className='sysRole-contain-search' style={{ marginBottom: 10 }}>
      <Form name='horizontal_login' layout='inline'>
        <Form.Item>
          <Input value={query.roleName} onChange={e => { setQuery({ ...query, roleName: e.target.value, fetch: false }) }} placeholder='角色名称' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item>
          <Input value={query.roleSign} onChange={e => { setQuery({ ...query, roleSign: e.target.value, fetch: false }) }} placeholder='角色标识' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item>
          <Input value={query.remark} onChange={e => { setQuery({ ...query, remark: e.target.value, fetch: false }) }} placeholder='备注' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
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
    <div className='sysRole-contain-content'>
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
    <PermissionModal visible={permissionModalShow} roleId={permissionRoleId} changeVisiable={value => { setPermissionModalShow(value) }} />
  </div>
}
