import { applySearchParams } from '@oracly/pm-libs/script-src'
import uuidv4 from '@oracly/pm-libs/uuidv4'

import logger from '@lib/logger'

const required = (value) => {
  if (typeof value === 'undefined') {
    throw new Error('Could not find configuration')
  }
  return value
}

let cfg = {
  automount: true,
  app_name: 'pm-marketing',
  app_instance_id: 'pm-marketing:' + uuidv4(),
  debug: process.env.DEBUG,
  env: required(process.env.NODE_ENV),

  apiurl: process.env.WEBAPI_URL,

  application_relaunch_timeout: 5000,
  application_relaunch_attempts: 10,
  application_relaunch_fallback_path: '/maintenance',
  base_path: '/',

  analytics_enabled: process.env.ANALYTICS_ENABLED,
  // i18n properties {
  default_locale: 'en',
  locize_default_ns: 'common',
  locize_project_id: process.env.LOCIZE_PROJECT_ID,
  locize_api_key: process.env.LOCIZE_API_KEY,
  locize_dev_mode: process.env.LOCIZE_DEV_MODE,
  localizations_resources_url_template: '',
  // }

  persistence_period_short: 1, // days
  persistence_period_long: 30, // days
  persistence_period_instance: 1, // days

  positioning_flickering_at: 15,
  positioning_hushed_at: 7,

}

cfg = applySearchParams(cfg)

cfg.is_development = cfg.env === 'development'
cfg.is_production = cfg.env === 'production'

logger.info('Application Config:', cfg)
export default cfg
