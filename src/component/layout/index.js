import React, { useState, useEffect } from 'react'

import './index.scss'
import { Layout, Menu, Breadcrumb, Row, Col, Dropdown, Tabs, Avatar } from 'antd'
import * as Icon from '@ant-design/icons'
import HomeOutlined from '@ant-design/icons/HomeOutlined'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import KeepAlive from 'react-activation'
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

  const buildRoute = (data) => {
    if (hasChildren(data)) {
      return <React.Fragment>
        {
          data.children.map(item => buildRoute(item))
        }
      </React.Fragment>
    }
    if (data.url) {
      return <Route key={data.url} path={match.url === '/' ? data.url : (match.url + data.url)}>
        {({ match }) => (
          wrapAnimation(match, () => import(`@/views${data.url}/index.js`))
        )}
      </Route>
    }
    return null
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
    const tempData = JSON.parse(JSON.stringify(res.data))
    tempData.forEach(item => {
      const stack = []
      stack.push(item)
      while (stack.length > 0) {
        const pop = stack.pop()
        if (pop.children && pop.children.length > 0) {
          const data = pop.children.filter(item => item.type === 2)
          if (data.length > 0) {
            if (pop.url) {
              routeList.push({
                path: pop.url,
                name: pop.name
              })
            }
          } else {
            pop.children.map(child => {
              stack.push(child)
            })
          }
        } else {
          if (pop.type !== 2 && pop.url) {
            routeList.push(buildRoute({
              path: pop.url,
              name: pop.name
            }))
          }
        }
      }
    })
    setRouteData(routeList)
    console.log(routeList)
  }
  const buildMenu = (data) => {
    const Com = Icon[data.icon] ? Icon[data.icon] : null
    if (hasChildren(data)) {
      return <SubMenu key={data.name} icon={Com ? <Com /> : null} title={data.name}>
        {data.children.map(item => buildMenu(item))}
      </SubMenu>
    }
    return <Menu.Item key={data.name} icon={Com ? <Com /> : null}>
      {data.url ? <Link to={data.url}>{data.name}</Link> : data.name}
    </Menu.Item>
  }
  const hasChildren = data => {
    if (!data.children) {
      return false
    }
    if (data.children.length === 0) {
      return false
    }
    if (data.children.filter(item => item.type === 2).length > 0) {
      return false
    }
    return true
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
          <Menu.Item key={'首页'} icon={<HomeOutlined />}>
            <Link to={'/home'}>{'首页'}</Link>
          </Menu.Item>
          {menuData.map(item => buildMenu(item))}
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
                    <Avatar src={userInfo.image} />
                    <span style={{ marginLeft: 5 }}>{userInfo.username}</span>
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
            <Switch>
              {
                menuData.map(item => buildRoute(item))
              }
            </Switch>

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            TT Admin @2020 Created by TONGXIN
        </Footer>
      </Layout>
    </Layout>
  </div> : null
}
