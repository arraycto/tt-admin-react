import React, { useState, useEffect } from 'react'

import { Button, Input, Table, Form, Tooltip } from 'antd'
import { list } from '@/api/system/log'

export default() => {
  const [tableData, setTableData] = useState([])
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    fetch: false,
    module: '',
    operationType: '',
    requestUrl: '',
    requestMethod: '',
    createUser: ''
  })
  const [tableLoading, setTableLoading] = useState(false)
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

  const columns = [
    {
      title: '主键',
      align: 'center',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '模块名',
      align: 'center',
      dataIndex: 'module',
      key: 'module'
    },
    {
      title: '操作类型',
      align: 'center',
      dataIndex: 'operationType',
      key: 'operationType'
    },
    {
      title: '请求地址',
      align: 'center',
      dataIndex: 'requestUrl',
      key: 'requestUrl'
    },
    {
      title: '请求方法',
      align: 'center',
      dataIndex: 'requestMethod',
      key: 'requestMethod'
    },
    {
      title: '请求参数',
      align: 'center',
      dataIndex: 'requestParam',
      key: 'requestParam',
      render: value => {
        return <Tooltip title={value}>
          <div style={{ maxWidth: 200, whiteSpace: 'nowrap', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value}
          </div>
        </Tooltip>
      }
    },
    {
      title: '请求耗时',
      align: 'center',
      dataIndex: 'requestTime',
      key: 'requestTime'
    },
    {
      title: '类方法',
      align: 'center',
      dataIndex: 'classMethod',
      key: 'classMethod',
      render: value => {
        return <Tooltip title={value}>
          <div style={{ maxWidth: 200, whiteSpace: 'nowrap', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value}
          </div>
        </Tooltip>
      }
    },
    {
      title: '操作人',
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
    }]
  return <div className='sysLog-contain'>
    <div className='sysLog-contain-search' style={{ marginBottom: 10 }}>
      <Form name='horizontal_login' layout='inline'>
        <Form.Item>
          <Input value={query.module} onChange={e => { setQuery({ ...query, module: e.target.value, fetch: false }) }} placeholder='模块名' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item>
          <Input value={query.operationType} onChange={e => { setQuery({ ...query, operationType: e.target.value, fetch: false }) }} placeholder='操作类型' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item>
          <Input value={query.requestMethod} onChange={e => { setQuery({ ...query, requestMethod: e.target.value, fetch: false }) }} placeholder='请求方法' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item>
          <Input value={query.createUser} onChange={e => { setQuery({ ...query, createUser: e.target.value, fetch: false }) }} placeholder='操作人' onPressEnter={() => setQuery({ ...query, pageNum: 1, fetch: true })} />
        </Form.Item>
        <Form.Item >
          <Button type='primary' onClick={() => { setQuery({ ...query, pageNum: 1, fetch: true }) }} >查询</Button>
        </Form.Item>
      </Form>
    </div>
    <div className='sysLog-contain-content'>
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
  </div>
}
