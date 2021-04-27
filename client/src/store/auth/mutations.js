export function setLoginApi (state, login) {
  state.loginApi = login
}

export function setUser (state, user) {
  state.user = user
}

export function setToken (state, token) {
  state.token = token
}

export function setWsApi (state, wsw) {
  state.wsApi = wsw
}

export function addMessage (state, msg) {
  state.messages.push(msg)
}


