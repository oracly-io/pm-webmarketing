import { toLower } from 'lodash'
import { toDecimal } from '@oracly/pm-libs/calc-utils'

import { PRICEFEED } from '@constants'

export function setCookie(name, value, daysToExpire = 365) {
  const expirationDate = new Date()
  expirationDate.setTime(expirationDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000))
  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`
  document.cookie = cookieString
}

export function getCookie(name) {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue)
    }
  }
  return null
}

export function toDecimalPricefeed(amount, pricefeed) {
  pricefeed = toLower(pricefeed)
  if (!amount) return amount
  if (!PRICEFEED.DECIMALS[pricefeed]) return amount

  return toDecimal(amount, PRICEFEED.DECIMALS[pricefeed])
}

export function updateSearchParam(param, value) {
  const url = new URL(window.location)
  url.searchParams.set(param, value || '')
  history.pushState(null, '', url.toString().replace(/=$/g, '').replace(/=&/g, '&'))
}

export function removeSearchParam(param) {
  const url = new URL(window.location)
  url.searchParams.delete(param)
  history.pushState(null, '', url)
}

export function removeUrlHash() {
  const url = new URL(window.location)
  url.hash = ''
  history.pushState(null, '', url)
}

export function updateUrlHash(hash) {
  const url = new URL(window.location)
  url.hash = hash
  history.pushState(null, '', url)
}
