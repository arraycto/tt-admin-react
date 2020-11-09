import React, { useCallback } from 'react'
import { useMappedState } from '@/store'
import { Card, Avatar } from 'antd'
export default () => {
  // 获取全局用户信息
  const { userInfo } = useMappedState(
    useCallback(
      state => ({
        userInfo: state.userInfo
      }), [])
  )
  return <div className='profile-contain'>
    <Card style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Avatar size={128} src={userInfo.image} />
        </div>
        <div style={{ flex: 1 }}>
          123asd
        </div>
      </div>
    </Card>
  </div>
}
