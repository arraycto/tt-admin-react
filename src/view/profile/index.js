import React from 'react'

import { Card, Avatar } from 'antd'
export default () => {
  return <div className='profile-contain'>
    <Card style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Avatar size={128} src={''} />
        </div>
        <div style={{ flex: 1 }}>
          123asd
        </div>
      </div>
    </Card>
  </div>
}
