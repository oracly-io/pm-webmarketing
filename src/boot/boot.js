import { delay } from 'lodash'

import config from '@config'
import logger from '@lib/logger'
import store from '@state/store'

import initGlobalFeatures from './initialization/initGlobalFeatures'
import initClients from './initialization/initClients'
import initActionsScheduler from './initialization/initActionsScheduler'

let attempts = 1
let initialized = false

const boot = (app) => {
  logger.info('Booting PariMarket Web Platform!')
  initGlobalFeatures()
  initClients()
  initActionsScheduler(store)
  initialized = true
  app()
}

const AppBoot = async () => {
  try {
    boot()
    attempts = 1
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    logger.info('Rebooting application attempt: %s', attempts++)
    delay(() => AppBoot(), config.application_relaunch_timeout)

    if (attempts > config.application_relaunch_attempts) {
      window.location.href = config.application_relaunch_fallback_path
    }
  }
}

const bootHandler = (event) => {
  const message = event.data
  if (message.mount_application !== config.app_name) return
  if (!initialized) {
    AppBoot()
  } else {
    logger.info('Applicaion is already initialized')
  }
}

window.addEventListener('message', bootHandler, false)
window.addEventListener('load', function () {
  if (config.automount) {
    window.postMessage(
      {
        mount_application: config.app_name,
      },
      '*'
    )
  }
})

if (process.env.NODE_ENV === 'development') {
  localStorage.debug = '*'
}

export default boot