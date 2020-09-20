import React from 'react'

import './index.scss'

import { observer } from 'mobx-react'
import { Table } from 'antd'
import { getUserList } from '@/api/user'
import { observable } from 'mobx'
@observer
class User extends React.Component {
  @observable tableData = []
  getUserList () {
    getUserList().then(res => {
      if (res.status === 200) {
        console.log(res.data)
      }
    })
  }
  componentDidMount () {
    this.getUserList()
  }
  render () {
    return <div>
      <Table data={this.tableData} />
    </div>
  }
}

export default User
