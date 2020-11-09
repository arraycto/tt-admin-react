import { INITIAL_STATE } from '@/store/index'

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    default:
      return { ...state, ...action.state }
  }
}
