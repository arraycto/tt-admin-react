import React, { useState, useEffect, useRef } from 'react'

import './index.scss'

import { Button, Divider, Input, Table, Tag, Form, Radio, Modal, notification } from 'antd'
import { getMenuPageList, deleteMenu, addMenu, updateMenu } from '@/api/system/menu'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import * as Icon from '@ant-design/icons'
import MenuIcon from './icon'

export default() => {
  const [tableData, setTableData] = useState([])
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    name: '',
    parentId: 0,
    fetch: false
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [iconShow, setIconShow] = useState(false)
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
    getMenuPageList(query).then(res => {
      setTableLoading(false)
      setTableData(res.data)
    }).catch(error => {
      console.error(error)
      setTableLoading(false)
    })
  }

  const saveMenu = (data) => {
    setFormModalSubmitButtonLoading(true)
    if (!data.id) {
      addMenu({ ...data }).then(res => {
        setFormModalSubmitButtonLoading(false)
        notification.success({ message: '添加成功', duration: 3 })
        setFormModalShow(false)
        setQuery({ ...query, pageNum: 1, fetch: true })
      })
    } else {
      updateMenu({ ...data }).then(res => {
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
        deleteMenu(data).then(res => {
          notification.success({ message: '删除成功', duration: 3 })
          setQuery({ ...query, fetch: true })
        })
      }
    })
  }
  const renderIcon = icon => {
    const Ioc = Icon[icon]
    if (Ioc) {
      return <Ioc style={{ fontSize: 24 }} />
    }
    return null
  }

  const columns = [{
    title: '序号',
    align: 'center',
    dataIndex: 'id',
    width: '10%',
    key: 'id'
  }, {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
    width: '10%',
    key: 'name'
  }, {
    title: '链接',
    dataIndex: 'url',
    align: 'center',
    width: '10%',
    key: 'url'
  }, {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    width: '10%',
    key: 'icon',
    render: value => {
      if (!value) {
        return null
      }
      const Ioc = Icon[value]
      console.log(Ioc)
      if (Ioc === undefined) {
        return null
      }
      return <Ioc style={{ fontSize: 26 }} />
    }
  }, {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    width: '10%',
    key: 'type',
    render: value => {
      switch (value) {
        case 1:
          return <Tag color='blue'>菜单</Tag>
        case 2:
          return <Tag color='lime'>按钮</Tag>
        case 3:
          return <Tag color='purple'>路由</Tag>
      }
    }
  }, {
    title: '操作',
    align: 'center',
    width: '20%',
    render: (value, record) => {
      return <div>
        <Button type='primary' onClick={() => {
          formInstance.current.setFieldsValue({ id: null, parentId: record.id, parentName: record.name })
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
  const resetForm = () => {

  }
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
          resetForm()
          setFormModalShow(false)
        }}>取消</Button>
        <Button loading={formModalSubmitButtonLoading} type='primary' onClick={() => {
          formInstance.current.validateFields()
            .then(values => {
              // 表单校验成功
              saveMenu(formInstance.current.getFieldValue())
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
        <Form.Item label='父节点'>
          <Input value={getFieldValue('parentId') === 0 ? '根节点' : getFieldValue('parentName')} disabled />
        </Form.Item>
        <Form.Item name='name' label='菜单名称' rules={[{ required: true, message: '必填' }]} hasFeedback>
          <Input />
        </Form.Item>
        <Form.Item name='url' label='链接'>
          <Input />
        </Form.Item>
        <Form.Item name='type' label='菜单类型' rules={[{ required: true, message: '必填' }]} hasFeedback>
          <Radio.Group
            options={[
              { label: '菜单', value: 1 },
              { label: '路由', value: 3 },
              { label: '按钮', value: 2 }
            ]}
          />
        </Form.Item>
        <Form.Item name='icon' label='图标'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 10 }}>{renderIcon(getFieldValue('icon') : '')}</span>
            <Button type='primary' size='small' onClick={() => { setIconShow(true) }} >点我选择</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  }
  return <div className='system-menu-contain'>
    <div className='system-menu-contain-search'>
      <Form name='horizontal_login' layout='inline'>
        <Form.Item>
          <Input value={query.name} onChange={e => { setQuery({ ...query, name: e.target.value, fetch: false }) }} placeholder='菜单名称' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item >
          <Button shape='circle' icon={<SearchOutlined />} onClick={() => { setQuery({ ...query, pageNum: 1, fetch: true }) }} />
        </Form.Item>
        <Form.Item >
          <Button type='primary' onClick={() => {
            formInstance.current.setFieldsValue({ id: null, parentId: 0 })
            setFormModalShow(true)
          }} >添加</Button>
        </Form.Item>
      </Form>
    </div>
    <div className='system-menu-contain-content'>
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
    <MenuIcon show={iconShow}
      onChange={value => {
        formInstance.current.setFieldsValue({ icon: value })
        setIconShow(false)
      }}
      onCancel={() => {
        setIconShow(false)
      }} />
    {renderFormModal()}
  </div>
}
