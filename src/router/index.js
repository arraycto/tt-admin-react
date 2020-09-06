import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { AliveScope } from 'react-activation'
import Layout from '@/component/layout'
import Login from '@/view/login'
export default () => {
  return (
    <Router>
      <Switch>
        <Route path={'/login'} component={Login} />
        <Route path={'/'} component={(props) => <AliveScope><Layout {...props} /></AliveScope>} />
      </Switch>
    </Router>
  )
}
