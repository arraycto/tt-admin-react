import React, { useState, useEffect } from 'react'

import './index.scss'
import { Layout, Menu, Breadcrumb, Row, Col, Dropdown, Tabs } from 'antd'
import {
  MailOutlined,
  UserOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import KeepAlive from 'react-activation'
import SysMenu from '@/view/system/menu'
import User from '@/view/system/user'
import Home from '@/view/home'
import { logout, getInfo } from '@/api/user'
import { getPermissionMenuList } from '@/api/menu'
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
  const [menuData, setMenuData] = useState([])
  const [routeData, setRouteData] = useState([])
  const [routeTabKey, setRouteTabKey] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    getUserInfoAndMenuData()
  }, [])
  // 监听地址栏URL变化，缓存路由tab
  useEffect(() => {
    const path = location.pathname === '/' ? routes[0].path : location.pathname
    setRouteTabKey(path)
    if (!routes.map(item => item.path).includes(path)) {
      const route = routeData.filter(item => item.path === path)
      if (route.length > 0) {
        routes.push({
          path: route[0].path,
          name: route[0].name
        })
        setRoutes([...routes])
      }
    }
  }, [routeData])
  useEffect(() => {
    const path = location.pathname === '/' ? routes[0].path : location.pathname
    setRouteTabKey(path)
    if (!routes.map(item => item.path).includes(path)) {
      const route = routeData.filter(item => item.path === path)
      if (route.length > 0) {
        routes.push({
          path: route[0].path,
          name: route[0].name
        })
        setRoutes([...routes])
      }
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

  const buildRoute = (obj, component) => {
    routeMap[obj.url] = {
      path: obj.url,
      name: obj.name
    }
    return {
      path: obj.url,
      name: obj.name,
      component: User
    }
  }
  const getUserInfoAndMenuData = async () => {
    window.loginGlobalMessageBoxCount = 1
    window.disableWarning = true
    try {
      let res = await getInfo()
      window.loginGlobalMessageBoxCount = 0
      window.disableWarning = false
      setUserInfo(res.data)
    } catch (error) {
      console.error(error)
      window.loginGlobalMessageBoxCount = 0
      window.disableWarning = false
      if (error.data.status === 401) {
        history.push({
          pathname: '/login',
          query: {
            path: location.pathname
          }
        })
      }
    }
    let res = await getPermissionMenuList({ parentId: 0 })
    setMenuData(res.data)
    const routeList = []
    res.data.forEach(item => {
      const stack = []
      stack.push(item)
      while (stack.length > 0) {
        const pop = stack.pop()
        if (pop.children && pop.children.length > 0) {
          const data = pop.children.filter(item => item.type === 2)
          if (data.length > 0) {
            if (pop.url) {
              routeList.push(buildRoute(pop, { component: () => import(`@/views${pop.url}/index.js`) }))
            }
          } else {
            pop.children.map(child => {
              stack.push(child)
            })
          }
        } else {
          if (pop.type !== 2 && pop.url) {
            routeList.push(buildRoute(pop, { component: () => import(`@/views${pop.url}/index.js`) }))
          }
        }
      }
    })
    console.log(res.data)
    console.log(routeList)
    setRouteData(routeList)
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
            <Route exact path={'/'} >
              <Redirect to='/home' />
            </Route>
            <Route path={match.url === '/' ? '/home' : (match.url + '/home')} >
              {({ match }) => (
                wrapAnimation(match, Home)
              )}
            </Route>
            {
              routeData.map(item => <Route path={match.url === '/' ? item.path : (match.url + item.path)}>
                {({ match }) => (
                  wrapAnimation(match, item.component)
                )}
              </Route>)
            }

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            TT Admin @2020 Created by TONGXIN
        </Footer>
      </Layout>
    </Layout>
  </div> : null
}
