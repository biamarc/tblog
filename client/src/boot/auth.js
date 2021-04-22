import Login from '../models/login'

export default async ( { store } ) => {
  const login = new Login()

  // perform initialization and verify if the user ws authenticated
  await login.init()
  // commit api to store
  store.commit('auth/setLoginApi', login)
  // if already authenticate provide commit to the store
  if (login.isAuthenticated){
    store.commit('auth/setUser', login.user)
    store.commit('auth/setToken', await login.getJWTToken())
  }
}
