export async function login( {state,commit}) {
  if (state.loginApi.isAuthenticated) {
    commit('setUser', state.loginApi.user)
    commit('setToken', await state.loginApi.getJWTToken() )
    return
  }
  state.loginApi.loginWithRedirect()
}

export async function logout( {state, commit}) {
  if (state.loginApi.isAuthenticated) {
    await state.loginApi.logout()
    state.wsApi.close()
  }
  commit('setUser', null)
  commit('setToken', null)
}
