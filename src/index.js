import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import { Provider } from 'mobx-react'
import './index.scss'
import App from '@/router'

ReactDOM.render(<Provider {...store}>
  <App />
</Provider>
, document.getElementById('root'))
