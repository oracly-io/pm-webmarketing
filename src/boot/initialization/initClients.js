import { PriceFeedApi } from '@oracly/pm-libs/pm-api-client'

import logger from '@lib/logger'

import config from '@config'

export default function initClients() {
  logger.info('Init clients')

  PriceFeedApi.baseUrl = config.apiurl
}
