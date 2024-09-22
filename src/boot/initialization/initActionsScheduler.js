import { ActionScheduler } from '@oracly/pm-libs/action-scheduler'
import { query } from '@oracly/pm-libs/redux-cqrs'

const initActionsScheduler = (store) => {
  ActionScheduler.init({
    query: { store, dispatch: (name, args) => store.dispatch(query(name, args)) },
  })
}

export default initActionsScheduler
