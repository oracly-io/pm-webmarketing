import { isEmpty } from 'lodash'
import { success } from '@oracly/pm-libs/redux-cqrs'
import { set, get } from '@oracly/pm-libs/immutable'

import { GET_PRICE_FEED } from '@state/actions'
import { toDecimalPricefeed } from '@utils'

function addPrices(state, pricefeed, data) {

  if (!pricefeed || isEmpty(data)) return state

  let latestTS = 0
  state = set(state, ['chartdata', pricefeed], feed => {
    for (const ts in data) {

      const value = get(data, [ts, '0'])

      feed[ts] = toDecimalPricefeed(value, pricefeed)

      if (latestTS < ts) latestTS = ts
    }
    return feed
  })

  const oldlatest = get(state, ['latest', pricefeed])
  if (!oldlatest || oldlatest.timestamp < latestTS) {
    state = set(state, ['latest', pricefeed], {
      timestamp: latestTS,
      value: get(state, ['chartdata', pricefeed, latestTS])
    })
  }

  return state
}

export default {
  [success(GET_PRICE_FEED)]: (state, { pricefeed, result: { data } }) => {
    return addPrices(state, pricefeed, data)
  },
}

