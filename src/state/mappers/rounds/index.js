import { isEmpty } from 'lodash'
import { nowUnixTS } from '@oracly/pm-libs/date-utils'
import { keccak256 } from '@oracly/pm-libs/hash-utils'

import { PRIZEFUNDS, UNIX_DAY } from '@constants'

export function toActualRoundId(game) {

  const { gameid, schedule } = game

  const now = nowUnixTS()
  const sinceStart = now % schedule
  const startDate = now - sinceStart

  const roundid = keccak256([gameid, startDate], ['bytes32', 'uint256'])

  return roundid
}

export function toActualRound(game) {

  if (isEmpty(game)) return null

  const { gameid, pricefeed, positioning, schedule, erc20 } = game

  const now = nowUnixTS()
  const sinceStart = now % schedule
  const startDate = now - sinceStart
  const endDate = startDate + schedule
  const lockDate = startDate + positioning
  // TODO: remove fallback 24h, UNIX_DAY expiration date
  // as soon as it's impelemnted on backend
  const expirationDate = endDate + (game.expiration || UNIX_DAY)

  const roundid = toActualRoundId(game)

  const round = {
    roundid,
    gameid,
    erc20,
    pricefeed,

    startDate,
    lockDate,
    endDate,
    expirationDate,

    resolved: false,
    phantom: true,

    predictions: 0,
    bettors: 0,

    prizefunds: {
      [PRIZEFUNDS.UP]: '0',
      [PRIZEFUNDS.DOWN]: '0',
      [PRIZEFUNDS.EQUAL]: '0',
      [PRIZEFUNDS.TOTAL]: '0',
    }
  }

  return round

}

