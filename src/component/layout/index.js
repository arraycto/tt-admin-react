import React, { useState, useEffect } from 'react'

import './index.scss'
import { Layout, Menu, Breadcrumb, Row, Col, Dropdown, Tabs } from 'antd'
import {
  MailOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { Route, Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import KeepAlive from 'react-activation'
import SysMenu from '@/view/system/menu'
import Home from '@/view/home'
import { logout, getInfo } from '@/api/user'
const {
  Header, Content, Footer, Sider
} = Layout
const SubMenu = Menu.SubMenu

const wrapAnimation = (match, Component) => {
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

const routeMap = {
  '/home': {
    path: '/home',
    name: '首页'
  },
  '/system/user': {
    path: '/system/user',
    name: '用户管理'
  }
}
export default ({ location, match, history }) => {
  const [userInfo, setUserInfo] = useState({
    username: ''
  })
  const [routes, setRoutes] = useState([{
    path: '/home',
    name: '首页',
    disableClose: true
  }])
  const [routeTabKey, setRouteTabKey] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    getUserInfo()
  }, [])
  useEffect(() => {
    setRouteTabKey(location.pathname)
    if (!routes.map(item => item.path).includes(location.pathname)) {
      routes.push(routeMap[location.pathname])
      setRoutes([...routes])
    }
  }, [location])
  const logoutHandle = () => {
    logout().then(res => {
      if (res.status === 200) {
        history.push({
          pathname: '/login',
          query: {
            path: location.pathname
          }
        })
      }
    })
  }
  const getUserInfo = () => {
    window.loginGlobalMessageBoxCount = 1
    window.disableWarning = true
    getInfo().then(res => {
      window.loginGlobalMessageBoxCount = 0
      window.disableWarning = false
      if (res.status === 200) {
        setUserInfo(res.data)
      }
    }).catch(res => {
      console.error(res)
      window.loginGlobalMessageBoxCount = 0
      window.disableWarning = false
      if (res.data.status === 401) {
        history.push({
          pathname: '/login',
          query: {
            path: location.pathname
          }
        })
      }
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key='0'>
          个人中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='3' onClick={logoutHandle}>
          退出登录
      </Menu.Item>
    </Menu>
  )
  return userInfo.username ? <div className={'app-contain'}>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => { setCollapsed(value) }}>
        <div className='app-contain-logo' >{collapsed ? 'TT' : 'TT Admin'}</div>
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
                    <UserOutlined /><span style={{ marginLeft: 5 }}>{userInfo.username}</span>
                  </span>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Header>
        <Content>
          <div className='app-contain-tag'>
            <Tabs hideAdd type='editable-card' activeKey={routeTabKey}
              onEdit={(targetKey, action) => {
                const index = routes.map(item => item.path).indexOf(targetKey)
                setRouteTabKey(routes[index - 1].path)
                history.push(routes[index - 1].path)
                routes.splice(routes.map(item => item.path).indexOf(targetKey), 1)
                setRoutes([...routes])
              }}
              onChange={key => {
                history.push(key)
              }}>
              {routes.map(route => (
                <Tabs.TabPane tab={route.name} key={route.path} closable={!route.disableClose} />
              ))}
            </Tabs>
          </div>
          <div className='app-contain-content'>
            <Route path={match.url === '/' ? '/home' : (match.url + '/home')} >
              {({ match }) => (
                wrapAnimation(match, Home)
              )}
            </Route>
            <Route path={match.url === '/' ? '/system/user' : (match.url + '/system/user')}>
              {({ match }) => (
                wrapAnimation(match, SysMenu)
              )}
            </Route>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  </div> : null
}
