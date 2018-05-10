'use strict'

import React from 'react'
import {BrowserRouter as Router, HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import Full from 'ayla-client/react/containers/Full'
import Login from 'ayla-client/react/views/Pages/Login'
import 'ayla-client/react/styles'

// Main app with Login
let Routers = () => <HashRouter>
                      <Switch>
                        <Route path="/login" name="Login" component={Login} />
                        <Route path="/" name="Home" component={Full} />
                      </Switch>
                    </HashRouter>


const Main = () => <Routers />

export default Main
