import React from 'react'

import './index.scss'

import { Input, Button, Layout, Form } from 'antd'
import { observer, inject } from 'mobx-react'
import { observable } from 'mobx'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '@/api/user'
@inject('user')
@observer
class Login extends React.Component {
  @observable loading = false
  @observable form = {
    username: '',
    password: ''
  }

  get store () {
    return this.props.user
  }
  login = () => {
    login(this.form).then(res => {
      if (res.data.status === 200) {
        this.store.login(res.data.data)
        this.props.history.push('/')
      }
    })
  }

  render () {
    return <div className='login-contain'>
      <Layout className='full-layout login-page'>
        <Layout.Content>
          <Form className='login-form'>
            <div className='user-img'>
              <img alt='logo' />
              <b>TT</b>
              <span>Admin</span>
            </div>
            <Form.Item>
              <Input size='large' prefix={<UserOutlined />} placeholder='用户名' value={this.form.username} onChange={e => { this.form.username = e.target.value }} />
            </Form.Item>
            <Form.Item>
              <Input size='large' prefix={<LockOutlined />} type='password' placeholder='密码' value={this.form.password} onChange={e => { this.form.password = e.target.value }} />
            </Form.Item>
            <Form.Item>
              <Button size='large' type='primary' className='login-form-button' loading={this.loading} onClick={this.login}> 登录</Button>
            </Form.Item>
          </Form>
        </Layout.Content>
      </Layout>
    </div>
  }
}

export default Login
