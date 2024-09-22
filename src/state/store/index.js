import { createStore, applyMiddleware, compose } from 'redux'
import { isFunction } from 'lodash'
import { cqrsMiddleware } from '@oracly/pm-libs/redux-cqrs'

import asynchronous from '@asynchronous'
import config from '@config'
import reducer from '@state/reducer'

let _compose = compose
  if (
    config.is_development &&
    isFunction(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
  ) {
    _compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  }

const store = createStore(
  reducer,
  _compose(applyMiddleware(
    cqrsMiddleware(asynchronous),
  ))
)

export default store