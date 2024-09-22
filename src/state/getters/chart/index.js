import { get } from '@oracly/pm-libs/immutable'

export function getChartData(state) {
  return get(state, ['chart', 'chartdata'])
}

export function getPricefeedChartData(state, pricefeed) {
  const chartdata = getChartData(state)
  const result = get(chartdata, [pricefeed])

  return result
}

export function getPricefeedLatestPrice(state, pricefeed) {
  const latest = get(state, ['chart', 'latest'])
  const result = get(latest, [pricefeed])

  return result
}