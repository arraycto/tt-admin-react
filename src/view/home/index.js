import React, { useEffect, useState } from 'react'

import './index.scss'

import ReactMarkdown from 'react-markdown'
export default () => {
  const [content, setContent] = useState('')
  useEffect(() => {
    window.fetch('/README.md', {
      method: 'GET'
    })
      .then(res => res.text())
      .then(res => {
        setContent(res)
      })
  }, [])
  return <div className='home-contain'>
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
}
