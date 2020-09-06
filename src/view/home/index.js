import React from 'react'

import './index.scss'

import { observer } from 'mobx-react'
import { Input } from 'antd'
@observer
class Home extends React.Component {
  render () {
    return <div className='home-contain'>
      <Input />
    </div>
  }
}

export default Home
