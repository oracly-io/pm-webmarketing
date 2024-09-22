import { init } from '@oracly/pm-libs/date-utils'
import objectAssignPolyfill from '@oracly/pm-libs/object-assign'
import resizeObserverPolyfill from '@oracly/pm-libs/resize-observer'
import { addTouchClass } from '@oracly/pm-libs/touch-detect'

import logger from '@lib/logger'

let initialized = false

export default function initGlobalFeatures () {
  if (initialized) return logger.info('Global Features is already initialized')
  logger.info('Initializing global features.')

  init()

  addTouchClass()
  objectAssignPolyfill()
  resizeObserverPolyfill()

  initialized = true
}
