import { ActionScheduler } from '@oracly/pm-libs/action-scheduler'
import { nowUnixTS } from '@oracly/pm-libs/date-utils'

import { UNIX_DAY } from '@constants'
import { game } from '@data'
import { GET_PRICE_FEED } from '@state/actions'
import { getPricefeedLatestPrice } from '@state/getters'

export function init() {
  // Update pricefeed
  const getPricefeed = (query, state) => {
    const pricefeed = game.pricefeed
    if (pricefeed) {
      const latestprice = getPricefeedLatestPrice(state, pricefeed)
      const from = latestprice?.timestamp || nowUnixTS()-UNIX_DAY
      const to = nowUnixTS()
      query(GET_PRICE_FEED, { pricefeed, from, to }, { schedule: 4 })
    }
  }
  ActionScheduler.query.dispatchNow(getPricefeed)
  ActionScheduler.query.addCollector(getPricefeed)
}