export default function () {
  return {
    user: null, // logged use
    loginApi: null, // api for login/logout/authenticate user
    token: null, // jwt token
    wsApi: null, // web socket api wrapper
    messages: [] // notification from socket
  }
}
