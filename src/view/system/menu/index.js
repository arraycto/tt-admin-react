import React, { useState, useEffect } from 'react'

import './index.scss'

import { Button, Divider, Input, Table, Tag, Form } from 'antd'
import { getMenuPageList, deleteMenu } from '@/api/system/menu'
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
  useEffect(() => {
    getTableData()
    console.log(Object.keys(Icon))
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
      const Ioc = Icon[value]
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
      }
    }
  }, {
    title: '操作',
    align: 'center',
    width: '20%',
    render: (value, record) => {
      return <div>
        <Button type='primary' onClick={() => { setIconShow(true) }}>添加</Button>
        <Divider type='vertical' />
        <Button type='primary'>编辑</Button>
        <Divider type='vertical' />
        <Button type='danger'>删除</Button>
      </div>
    }
  }]
  return <div className='system-menu-contain'>
    <div className='system-menu-contain-search'>
      <Form name='horizontal_login' layout='inline'>
        <Form.Item>
          <Input value={query.name} onChange={e => { setQuery({ ...query, name: e.target.value, fetch: false }) }} placeholder='菜单名称' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item >
          <Button shape='circle' icon={<SearchOutlined />} onClick={() => { setQuery({ ...query, pageNum: 1, fetch: true }) }} />
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
    <MenuIcon show={iconShow} onCancel={() => { setIconShow(false) }} onChange={value => {
      console.log(value)
      setIconShow(false)
    }} />
  </div>
}
