import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { configureStore } from 'ayla-client/redux/stores/configure-store'

import 'ayla-helper/prototypes'
import 'typeface-roboto'

// google.maps.event.addDomListener(window, 'load', initAutocomplete)

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Main from './react'

const App = () => (
                    <MuiThemeProvider>
                      <Main />
                    </MuiThemeProvider>
                  )

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



renderApp(App)



const isDev = () => process.env.NODE_ENV === 'development'

if (isDev && module.hot) {
  module.hot.accept('./react', () => {
    renderApp(require('./react').default)
  })
}
