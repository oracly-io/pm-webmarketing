
import { initFeatures } from '@features'

import boot from './boot'

import '@lib/hackmd/index.scss'
import '@styles/app.scss'

function app() {
  initFeatures()
}

boot(app)