import React from 'react'

export default() => {
  return <div className='code-contain' style={{ width: '100%', height: '100%' }}>
    <iframe style={{ width: '100%', height: '100%', border: 'none' }} src={process.env === 'development' ? 'http://localhost:9090/code.html' : '/code.html'} />
  </div>
}
