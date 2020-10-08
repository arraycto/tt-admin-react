import React, { useState, useEffect } from 'react'

import './index.scss'

import { Input, Modal, Radio } from 'antd'
import * as Icon from '@ant-design/icons'
const unuse = ['setTwoToneColor', 'getTwoToneColor', 'createFromIconfontCN', 'default']
export default({ show = false, onChange, onCancel }) => {
  // 所有的图标名称集合
  const iconKeys = Object.keys(Icon).filter(item => !unuse.includes(item))
  // 线框风格图标
  const outlined = iconKeys.filter(item => item.endsWith('Outlined'))
  // 实底风格图标
  const filled = iconKeys.filter(item => item.endsWith('Filled'))
  // 双色风格图标
  const twoTone = iconKeys.filter(item => item.endsWith('TwoTone'))
  const iconData = {
    outlined,
    filled,
    twoTone
  }
  const [iconKey, setIconKey] = useState('outlined')
  const [iconKeyword, setIconKeyword] = useState('')
  return <div className='icon-contain' >
    <Modal
      className='icon-contain-modal'
      width={800}
      title='选择图标'
      visible={show}
      onCancel={() => {
        if (onCancel) {
          onCancel()
        }
      }}
      footer={null}
    >
      <div>
        <Input.Group compact>
          <Radio.Group value={iconKey} buttonStyle='solid' onChange={e => { setIconKey(e.target.value) }}>
            <Radio.Button value='outlined'>线框风格</Radio.Button>
            <Radio.Button value='filled'>实底风格</Radio.Button>
            <Radio.Button value='twoTone'>双色风格</Radio.Button>
          </Radio.Group>
          <Input style={{ width: 300 }} value={iconKeyword} onChange={e => { setIconKeyword(e.target.value) }} placeholder='在此搜索图标，点击选择图标' />
        </Input.Group>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
            iconData[iconKey].filter(item => item.includes(iconKeyword)).map((item, index) => {
              const Ioc = Icon[item]
              return <p style={{ margin: 20, cursor: 'pointer' }} onClick={() => {
                console.log(item)
                if (onChange) {
                  onChange(item)
                }
              }}>
                <Ioc key={index} style={{ fontSize: 36 }} />
              </p>
            })
          }
        </div>

      </div>
    </Modal>
  </div>
}
