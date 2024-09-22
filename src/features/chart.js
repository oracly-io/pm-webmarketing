import { debounce, isEmpty } from 'lodash'
import { StickChart, EChartType } from '@oracly/pm-stickchart'

import config from '@config'
import { game } from '@data'
import { getPricefeedChartData } from '@state/getters'
import { toActualRound } from '@state/mappers'

import store from '@state/store'

export function init() {

  // Element
  const chartstageEl = document.getElementById('chartstage')
  const chartEl = document.getElementById('chart')

  const stickchart = new StickChart(chartstageEl, {
    positioning_flickering_at: config.positioning_flickering_at,
    positioning_hushed_at: config.positioning_hushed_at,
  })
  chartEl.appendChild(stickchart.canvas)

  // Events
  const debounced = debounce(() => chartstageEl.classList.remove('rendering'), 300)
  const observer = new ResizeObserver(([{ contentRect: { width, height } }]) => {
    if (!chartstageEl.classList.contains('rendering')) chartstageEl.classList.add('rendering')
    debounced()
    stickchart.setScreenSize({ width, height })
  })
  observer.observe(chartstageEl)

  const scrolltonowEl = document.getElementById('scrolltonow')
  stickchart.addEventListener(
    'timeframeTonow', (e) => {
      scrolltonowEl.classList.remove('scrolltonow--active')
    }
  )
  scrolltonowEl.addEventListener('click', () => { stickchart.resetTimeframe() })
  stickchart.addEventListener(
    'timeframeUnnow', (e) => {
      !scrolltonowEl.classList.contains('scrolltonow--active') && scrolltonowEl.classList.add('scrolltonow--active')
    }
  )

  // Render
  const renderChart = debounce(() => {
    const state = store.getState()
    const chartdata = getPricefeedChartData(state, game.pricefeed)
    const actualround = toActualRound(game)

    stickchart.render({
      game,
      rounds: { [actualround.ppolid]: actualround },
      charttype: EChartType.LINE,
      chartdata,
    })
  }, 30)

  stickchart.setTimeframe(game.schedule * 4)
  onChartReady(() => {
    renderChart()
    registerStoreUpdateReRender()
    registerActualRoundReRender()
  })

  function onChartReady(cb) {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      const chartdata = getPricefeedChartData(state, game.pricefeed)
      const isChartReady = !isEmpty(chartdata)

      if (isChartReady) {
        cb()
        unsubscribe()
      }
    })
  }

  function registerStoreUpdateReRender() {
    store.subscribe(renderChart)
  }

  function registerActualRoundReRender() {
    const actualround = toActualRound(game)
    const ms = actualround.endDate * 1000 - Date.now()

    setTimeout(() => {
      renderChart()
      registerActualRoundReRender()
    }, ms)
  }

}