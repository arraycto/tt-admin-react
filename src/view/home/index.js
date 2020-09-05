import React from 'react'

import './index.scss'

import { observer } from 'mobx-react'
import { observable } from 'mobx'

@observer
class Home extends React.Component {
  @observable loading = false
  @observable show = false
  @observable form={
    username: '',
    password: ''
  }

  get store () {
    return this.props.user
  }
  login = () => {
    this.props.history.push('/')
  }

  render () {
    return <div className='home-contain'>
     首页
    </div>
  }
}

export default Home
