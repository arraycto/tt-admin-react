import React from 'react'

import './index.scss'
import { Layout, Menu, Breadcrumb, Row, Col, Dropdown } from 'antd'
import {
  MailOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { Route, Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import KeepAlive, { withAliveScope } from 'react-activation'
import { observer, inject } from 'mobx-react'
import User from '@/view/system/user'
import Home from '@/view/home'
import { logout, getInfo } from '@/api/user'
const {
  Header, Content, Footer, Sider
} = Layout
const SubMenu = Menu.SubMenu

const wrapAnimation = (match, Component) => {
  console.log(match ? match.url : '')
  return <CSSTransition
    in={match !== null}
    classNames='page'
    timeout={300}
    mountOnEnter
    unmountOnExit
  >
    <KeepAlive name={match ? match.url : ''}>
      <Component />
    </KeepAlive>
  </CSSTransition>
}
@withAliveScope
@inject('app')
@inject('user')
@observer
class MyLayout extends React.Component {
  get app () {
    return this.props.app
  }
  get user () {
    return this.props.user
  }
  onCollapseChange = collapsed => {
    this.app.collapsed = collapsed
  }
  logout=() => {
    logout().then(res => {
      if (res.data.status === 200) {
        this.user.logout()
        this.props.history.push('/login')
      }
    })
  }
  getInfo=() => {
    getInfo().then(res => {
      if (res.data.status === 200) {
        this.user.login(res.data.data)
      } else {
        this.user.logout()
        this.props.history.push('/login')
      }
    })
  }
  componentDidMount () {
    this.getInfo()
  }
  render () {
    console.log(this.props)
    const menu = (
      <Menu>
        <Menu.Item key='0'>
          个人中心
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key='3' onClick={this.logout}>
          退出登录
        </Menu.Item>
      </Menu>
    )
    const { match } = this.props
    return <div className={'app-contain'}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.app.collapsed} onCollapse={this.onCollapseChange}>
          <div className='logo'>TT Admin</div>>
          <Menu theme='dark' mode='inline'>
            <Menu.Item key='home' icon={<HomeOutlined />}>
              <Link to={'/home'}>首页</Link>
            </Menu.Item>
            <SubMenu key='system' icon={<MailOutlined />} title='系统管理'>
              <Menu.Item key='5'>
                <Link to={'/system/user'}>用户管理</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} >
            <Row justify='space-between'>
              <Col span={8}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 10px' }}>
                  <Breadcrumb>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <a href=''>系统管理</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <a href=''>用户管理</a>
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
              </Col>
              <Col>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 50px' }}>
                  <Dropdown overlay={menu} placement='bottomCenter' trigger={['click']}>
                    <span className='ant-dropdown-link' style={{ cursor: 'pointer' }} onClick={e => e.preventDefault()}>
                      <UserOutlined /><span style={{ marginLeft: 5 }}>童心</span>
                    </span>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </Header>
          <Content style={{ padding: 20 }}>
            <Route path={match.url === '/' ? '/home' : (match.url + '/home')} >
              {({ match }) => (
                wrapAnimation(match, Home)
              )}
            </Route>
            <Route path={match.url === '/' ? '/system/user' : (match.url + '/system/user')}>
              {({ match }) => (
                wrapAnimation(match, User)
              )}
            </Route>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  }
}

export default MyLayout
