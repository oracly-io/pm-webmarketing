import { rootReducer, combine } from '@state/reducer/utils'

import chart from './chart'

const rootCombination = combine({
  chart,
})

export default rootReducer(rootCombination)
