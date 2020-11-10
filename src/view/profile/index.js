import React, { useCallback, useState } from 'react'
import { useMappedState } from '@/store'
import { Card, Avatar, List, Input, notification, Radio, Upload } from 'antd'
import { updateCurrentUser } from '@/api/system/user'
import { updateState } from '@/action'
export default () => {
  // 获取全局用户信息
  const { userInfo } = useMappedState(
    useCallback(
      state => ({
        userInfo: state.userInfo
      }), [])
  )
  const [password, setPassword] = useState({
    value: '',
    edit: false
  })
  const [name, setName] = useState({
    value: '',
    edit: false
  })
  const [sex, setSex] = useState({
    value: '',
    edit: false
  })
  const [email, setEmail] = useState({
    value: '',
    edit: false
  })
  const [mobile, setMobile] = useState({
    value: '',
    edit: false
  })
  const updateUser = (data) => {
    updateCurrentUser({ ...data }).then(res => {
      notification.success({ message: '修改成功' })
      updateState({ userInfo: { ...userInfo, ...data } })
    }).catch(e => {
      console.error(e)
    })
  }
  return <div className='profile-contain'>
    <Card style={{ width: '100%' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Upload
              showUploadList={false}
              data={{
                directory: '/user_header_image'
              }}
              action='/file/uploadFeFile'
              onChange={info => {
                if (info.file.status === 'uploading') {
                  return
                }
                if (info.file.status === 'done') {
                  console.log(info.file.response.data)
                  updateUser({ image: info.file.response.data })
                }
              }}
            >
              <Avatar size={128} src={userInfo.image} />
            </Upload>
            <p style={{ textAlign: 'center', marginTop: 10 }}>{userInfo.username}</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <List
            className='demo-loadmore-list'
            itemLayout='horizontal'
          >
            {/* 密码 */}
            <List.Item actions={[<a key='list-loadmore-edit' onClick={() => {
              if (password.edit && password.value) {
                updateUser({ password: password.value })
              }
              setPassword({ ...password, edit: !password.edit })
            }}>{password.edit ? '保存' : '修改'}</a>]}>
              <List.Item.Meta
                title={'密码'}
                description={password.edit ? <Input value={password.value} onChange={e => {
                  setPassword({ ...password, value: e.target.value })
                }} /> : <span>*******</span>}
              />
            </List.Item>
            {/* 姓名 */}
            <List.Item actions={[<a key='list-loadmore-edit' onClick={() => {
              if (name.edit && name.value) {
                updateUser({ name: name.value })
              }
              setName({ ...name, edit: !name.edit })
            }}>{name.edit ? '保存' : '修改'}</a>]}>
              <List.Item.Meta
                title={'姓名'}
                description={name.edit ? <Input value={name.value} onChange={e => {
                  setName({ ...name, value: e.target.value })
                }} /> : <span>{userInfo.name}</span>}
              />
            </List.Item>
            {/* 性别 */}
            <List.Item actions={[<a key='list-loadmore-edit' onClick={() => {
              if (sex.edit && sex.value) {
                updateUser({ sex: sex.value })
              }
              setSex({ ...sex, edit: !sex.edit })
            }}>{sex.edit ? '保存' : '修改'}</a>]}>
              <List.Item.Meta
                title={'性别'}
                description={sex.edit ? <Radio.Group onChange={e => {
                  setPassword({ ...sex, value: e.target.value })
                }} value={sex.value}>
                  <Radio value={1}>男</Radio>
                  <Radio value={2}>女</Radio>
                </Radio.Group> : <span>{userInfo.sex === 1 ? '男' : '女'}</span>}
              />
            </List.Item>
            {/* 邮箱 */}
            <List.Item actions={[<a key='list-loadmore-edit' onClick={() => {
              if (email.edit && email.value) {
                updateUser({ email: email.value })
              }
              setEmail({ ...email, edit: !email.edit })
            }}>{email.edit ? '保存' : '修改'}</a>]}>
              <List.Item.Meta
                title={'邮箱'}
                description={email.edit ? <Input value={email.value} onChange={e => {
                  setEmail({ ...email, value: e.target.value })
                }} /> : <span>{userInfo.email}</span>}
              />
            </List.Item>
            {/* 电话 */}
            <List.Item actions={[<a key='list-loadmore-edit' onClick={() => {
              if (mobile.edit && mobile.value) {
                updateUser({ mobile: mobile.value })
              }
              setMobile({ ...mobile, edit: !mobile.edit })
            }}>{mobile.edit ? '保存' : '修改'}</a>]}>
              <List.Item.Meta
                title={'电话'}
                description={mobile.edit ? <Input value={mobile.value} onChange={e => {
                  setMobile({ ...mobile, value: e.target.value })
                }} /> : <span>{userInfo.mobile}</span>}
              />
            </List.Item>
          </List>
        </div>
      </div>
    </Card>
  </div>
}
