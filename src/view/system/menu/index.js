import React, { useState, useEffect } from 'react'

import './index.scss'

import { Button, Divider, Table, Tag } from 'antd'
import { getUserList } from '@/api/user'
export default() => {
  const [tableData, setTableData] = useState([])
  useEffect(() => {
    getUserData()
  }, [])
  const getUserData = () => {
    getUserList().then(res => {
      if (res.status === 200) {
        console.log(res.data)
        setTableData(res.data)
      }
    })
  }
  const columns = [{
    title: '序号',
    align: 'center',
    dataIndex: 'id',
    key: 'id'
  }, {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
    key: 'name'
  }, {
    title: '链接',
    dataIndex: 'url',
    align: 'center',
    key: 'url'
  }, {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    key: 'icon'
  }, {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    key: 'type',
    render: value => {
      switch (value) {
        case 1:
          return <Tag>菜单</Tag>
        case 2:
          return <Tag>按钮</Tag>
      }
    }
  }, {
    title: '操作',
    render: (value, record) => {
      return <div>
        <Button type='primary'>添加</Button>
        <Divider />
        <Button type='primary'>编辑</Button>
        <Divider />
        <Button type='danger'>删除</Button>
        <Divider />
      </div>
    }
  }]
  return <div>
    <Table data={tableData} columns={columns} />
  </div>
}
