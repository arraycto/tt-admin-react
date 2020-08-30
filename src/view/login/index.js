import React from 'react'

import './index.scss'

import { Input, Button } from 'antd'
import { observer } from 'mobx-react'

@observer
class Login extends React.Component {
  render () {
    return <div>
      <Input />
      <Button type={'primary'} onClick={() => {
        this.props.history.push('/')
      }}>登录</Button>
    </div>
  }
}

export default Login
