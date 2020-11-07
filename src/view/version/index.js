import React, { useState, useEffect, useRef } from 'react'

import { Button, Divider, Input, Table, Form, Modal, notification } from 'antd'
import { list, remove, add, update } from '@/api/system/version'

export default() => {
  const [tableData, setTableData] = useState([])
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    fetch: false
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
      title: '版本号',
      align: 'center',
      dataIndex: 'feVersion',
      key: 'feVersion'
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'createUser',
      key: 'createUser'
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '更新时间',
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
        <Form.Item label='版本号' name='feVersion' rules={[{ required: true, message: '必填' }]} hasFeedbac>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  }
  return <div className='sysFeVersion-contain'>
    <div className='sysFeVersion-contain-search' style={{ marginBottom: 10 }}>
      <Form name='horizontal_login' layout='inline'>
        <Form.Item >
          <Button type='primary' onClick={() => {
            formInstance.current.setFieldsValue({ id: null, parentId: 0 })
            setFormModalShow(true)
          }} >添加</Button>
        </Form.Item>
      </Form>
    </div>
    <div className='sysFeVersion-contain-content'>
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
