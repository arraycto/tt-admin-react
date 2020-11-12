import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { AliveScope } from 'react-activation'
import Layout from '@/component/layout'
import Login from '@/view/login'
export default () => {
  return (
    <Router>
      <AliveScope>
        <Switch>
          <Route path={'/login'} component={Login} />
          <Route path={'/'} component={Layout} />
        </Switch>
      </AliveScope>
    </Router>
  )
}
