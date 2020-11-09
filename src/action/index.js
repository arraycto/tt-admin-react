import { store } from '@/store'

export const updateState = (state) => {
  store.dispatch({ type: '', state })
}
