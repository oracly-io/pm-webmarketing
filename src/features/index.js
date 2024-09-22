import { init as initWhitePaper } from './white-paper'
import { init as initScheduledActions } from './scheduled-actions'
import { init as initChart } from './chart'
import { init as initSmoothScrolling } from './smooth-scrolling'
import { init as initInteractivity } from './interactivity'
import { init as initDocumentation } from './documentation'

export function initFeatures() {
  initDocumentation()
  initWhitePaper()
  initScheduledActions()
  initChart()
  initSmoothScrolling()
  initInteractivity()
}