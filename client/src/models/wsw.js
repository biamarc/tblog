export const W3CWebSocket = require('websocket').w3cwebsocket;

/**
 * Class Web socket wrapper
 */
export class Wsw {
  constructor(wsUrl) {
    this.api = null // api
    this.wsUrl = wsUrl // web socket url
  }

  _checkApi(method) {
    if (this.api === null) {
      throw Error(`${method} method must be called after open connection with open(url)`)
    }
  }

  open() {
    console.log(this.wsUrl)
    try {
      this.api = new W3CWebSocket(this.wsUrl,[])
    } catch (e){
      console.error('Error open wss',e)
    }
  }

  close() {
    this._checkApi('close')
    this.api.close()
    this.api = null
  }

  auth(token) {
    this._checkApi('auth')
    const obj = {
      action: "register",
      token: token
    }
    console.log('auth with token')
    this.api.send(JSON.stringify(obj))
  }

  onOpen(callback) {
    this._checkApi('onOpen')
    this.api.onopen = callback
  }

  onClose(callback) {
    this._checkApi('onClose')
    this.api.onclose = callback
  }

  onMessage(callback) {
    this._checkApi('onMessage')
    this.api.onmessage = callback
  }

  onError(callback) {
    this._checkApi('onError')
    this.api.onerror = callback
  }
}
