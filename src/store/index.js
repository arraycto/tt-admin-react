import { createStore } from 'redux'
import reducer from '@/reducer'
import { create } from 'redux-react-hook'

export const INITIAL_STATE = {
  userInfo: {
    username: ''
  }
}
export const store = createStore(reducer, INITIAL_STATE)

export const { StoreContext, useDispatch, useMappedState } = create()
