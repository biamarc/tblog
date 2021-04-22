
export function getUser (state) {
  return state.user
}

export function isLogged (state) {
  return state.user !== null
}

export function getToken (state) {
  return state.token
}

export function getLoginApi (state) {
  return state.loginApi
}


