import React, { useState, useEffect, useRef } from 'react'

import { Button, Divider, Input, Table, Form, Modal, notification } from 'antd'
import { list, remove, add, update } from '@/api/system/dept'

export default() => {
  const [tableData, setTableData] = useState([])
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    fetch: false,
    parentId: 0,
    deptName: '',
    status: ''
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [formModalShow, setFormModalShow] = useState(false)
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
      title: '部门名称',
      align: 'center',
      dataIndex: 'deptName',
      key: 'deptName'
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
            formInstance.current.setFieldsValue({ id: null, parentId: record.id, parentName: record.deptName })
            setFormModalShow(true)
          }}>添加</Button>
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
        <Form.Item label='上级部门'>
          <Input value={getFieldValue('parentId') === 0 ? '无' : getFieldValue('parentName')} disabled />
        </Form.Item>
        <Form.Item label='部门名称' name='deptName' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  }
  return <div className='sysDept-contain'>
    <div className='sysDept-contain-search' style={{ marginBottom: 10 }}>
      <Form name='horizontal_login' layout='inline'>
        <Form.Item>
          <Input value={query.deptName} onChange={e => { setQuery({ ...query, deptName: e.target.value, fetch: false }) }} placeholder='部门名称' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
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
    <div className='sysDept-contain-content'>
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
