import React from 'react'

import './index.scss'

import { observer } from 'mobx-react'

@observer
class User extends React.Component {
  onCollapseChange = collapsed => {
    this.props.app.collapsed = true
  }
  render () {
    return <div>
        123
    </div>
  }
}

export default User
