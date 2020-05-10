import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'
import { IDictState } from './modules/dict'
import { ITabState } from './modules/tab'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState,
  dict: IDictState,
  tab: ITabState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
