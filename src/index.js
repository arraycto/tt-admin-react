import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from '@/router'
import { StoreContext, store } from './store'
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>
  , document.getElementById('app'))
