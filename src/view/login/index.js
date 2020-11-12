import React, { useState } from 'react'

import './index.scss'

import { Input, Button, Layout, Form, Avatar } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '@/api/system/user'
import Logo from '@/images/logo.png'
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
      window.location.href = window.location.origin + '/#' + (location.query ? location.query.path : '/')
    }).catch(error => {
      console.log(error)
      setLoading(false)
    })
  }

  return <div className='login-contain'>
    <Layout className='full-layout login-page'>
      <Layout.Content>
        <Form className='login-form'>
          <div className='user-img'>
            <Avatar size={32} src={Logo} alt='logo' style={{ marginRight: 10 }} />
            <b>TT</b>
            <span>Admin</span>
          </div>
          <Form.Item>
            <Input size='large' prefix={<UserOutlined />} placeholder='用户名' value={form.username} onChange={e => { setForm({ ...form, username: e.target.value }) }} onPressEnter={startLogin} />
          </Form.Item>
          <Form.Item>
            <Input size='large' prefix={<LockOutlined />} type='password' placeholder='密码' value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }) }} onPressEnter={startLogin} />
          </Form.Item>
          <Form.Item>
            <Button size='large' type='primary' className='login-form-button' loading={loading} onClick={startLogin}> 登录</Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  </div>
}
