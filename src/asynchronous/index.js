import { PriceFeedApi } from '@oracly/pm-libs/pm-api-client'

import { GET_PRICE_FEED } from '@state/actions'

export default {
  [GET_PRICE_FEED]: PriceFeedApi.getRounds,
}
