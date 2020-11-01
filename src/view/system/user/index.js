import React, { useState, useEffect } from 'react'

import './index.scss'

import { Table } from 'antd'
import { getUserList } from '@/api/system/user'
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
  return <div>
    <Table data={tableData} />
  </div>
}
