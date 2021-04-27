import Login from '../models/login'
import {Wsw} from "src/models/wsw";
import domain from "src/models/domain";

export default async ( { store } ) => {
  const login = new Login()
  const wsw = new Wsw(domain.wss)

  // perform initialization and verify if the user was authenticated
  await login.init()
  // commit api to store
  store.commit('auth/setLoginApi', login)
  store.commit('auth/setWsApi', wsw)

  // if already authenticate provide commit to the store
  if (login.isAuthenticated){
    store.commit('auth/setUser', login.user)
    store.commit('auth/setToken', await login.getJWTToken())

    // open wss only for authenticated user
    wsw.open()
    wsw.onError((e) => console.error('Error connecting wss', e))
    wsw.onClose((e) => console.info('Close connection wss', e))
    wsw.onMessage((e) => store.commit('auth/addMessage', JSON.parse(e.data)))
    wsw.onOpen(() => wsw.auth(store.state.auth.token))
  }
}
