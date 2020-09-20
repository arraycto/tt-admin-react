import React, { useState } from 'react'

import './index.scss'

import { Input, Button, Layout, Form } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '@/api/user'
export default ({ location, match, history }) => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const startLogin = () => {
    setLoading(true)
    login(form).then(res => {
      setLoading(false)
      if (res.status === 200) {
        window.location.href = window.location.origin + '/#' + (location.query ? location.query.path : '/')
      }
    })
  }

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
            <Input size='large' prefix={<UserOutlined />} placeholder='用户名' value={form.username} onChange={e => { setForm({ ...form, username: e.target.value }) }} />
          </Form.Item>
          <Form.Item>
            <Input size='large' prefix={<LockOutlined />} type='password' placeholder='密码' value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }) }} />
          </Form.Item>
          <Form.Item>
            <Button size='large' type='primary' className='login-form-button' loading={loading} onClick={startLogin}> 登录</Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  </div>
}
