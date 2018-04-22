import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { configureStore } from 'ayla-client/redux/stores/configure-store'

import Main from './react'

const store = configureStore()
const rootElement = document.getElementById('root')

const renderApp = Component => {
  render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>
    , rootElement
  )
}

renderApp(Main)

const isDev = () => process.env.NODE_ENV === 'development'

if (isDev && module.hot) {
  module.hot.accept('./react', () => {
    renderApp(require('./react').default)
  })
}
