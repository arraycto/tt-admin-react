import React from 'react'

import './index.scss'

import { Layout, Menu } from 'antd'
import {
  MailOutlined
} from '@ant-design/icons'
import { Route, Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import User from '@/view/system/user'

const {
  Header, Content, Footer, Sider
} = Layout
const SubMenu = Menu.SubMenu

@inject('app')
@observer
class MyLayout extends React.Component {
  get store () {
    return this.props.app
  }
  onCollapseChange = collapsed => {
    this.store.collapsed = collapsed
  }
  render () {
    const { match } = this.props
    return <div className={'app-contain'}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.store.collapsed} onCollapse={this.onCollapseChange}>
          <div className='logo' />
          <Menu theme='dark' mode='inline'>
            <SubMenu key='system' icon={<MailOutlined />} title='系统管理'>
              <Menu.Item key='5'>
                <Link to={'/system/user'}>用户管理</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content>
            <Route path={match.url === '/' ? '/system/user' : (match.url + '/system/user')} component={User} />
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
