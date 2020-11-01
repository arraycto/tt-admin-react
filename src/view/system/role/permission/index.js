import React, { useState, useEffect } from 'react'

import { Tree, Modal, Button, notification } from 'antd'
import { getMenuAllList, getRoleMenu } from '@/api/system/menu'
import { addMenuPermission } from '@/api/system/role'

export default({ visible, roleId, changeVisiable }) => {
  const [menuIdList, setMenuIdList] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [menuTreeData, setMenuTreeData] = useState([])
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(visible)
    if (visible) {
      getMenuAllData()
      getRoleMenuData()
    }
  }, [visible, roleId])

  const submit = () => {
    setSubmitButtonLoading(true)
    addMenuPermission({ roleId, menuIdList }).then(res => {
      setSubmitButtonLoading(false)
      notification.success({ message: '权限变更成功' })
      changeVisiable(false)
    }).catch(error => {
      setSubmitButtonLoading(false)
      console.error(error)
    })
  }

  const getMenuAllData = () => {
    getMenuAllList({ parentId: 0 }).then(res => {
      setMenuTreeData(res.data)
      // 获取全部id
      const allIds = []
      res.data.forEach(item => {
        const stack = []
        stack.push(item)
        while (stack.length !== 0) {
          const pop = stack.pop()
          allIds.push(pop.id)
          if (pop.children && pop.children.length !== 0) {
            pop.children.forEach(item => { stack.push(item) })
          }
        }
      })
      setExpandedKeys(allIds)
    }).catch(error => {
      console.error(error)
    })
  }
  const getRoleMenuData = () => {
    getRoleMenu({ roleId }).then(res => {
      setMenuIdList(res.data)
    }).catch(error => {
      console.error(error)
    })
  }
  const onCheck = (checkedKeys, info) => {
    const keys = []
    info.checkedNodes.forEach(item => {
      if (item.id) {
        keys.push(item.key)
      }
    })
    setMenuIdList(keys)
  }
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
  }
  return <div className='sysRole-contain' >
    <Modal
      title='权限'
      visible={show}
      width={600}
      onCancel={() => {
        changeVisiable(false)
      }}
      footer={<div>
        <Button type='primary' loading={submitButtonLoading} onClick={submit}>确定</Button>
      </div>}
    >
      <div style={{ minHeight: 400, maxHeight: 500, overflow: 'auto' }}>
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent
          checkedKeys={menuIdList}
          onCheck={onCheck}
          treeData={menuTreeData}
        />
      </div>

    </Modal>

  </div>
}
