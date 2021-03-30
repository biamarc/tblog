import axios from 'axios'
import Domain  from '../models/domain'

/**
 * Build Authorization Header
 * @param config
 * @param idToken
 * @return {function(*): *}
 */

class CustomAxios {
  // class to build client
  _axios;
  // base url to call
 _baseUrl;

  constructor(axios, baseUrl) {
    this._axios = axios
    this._baseUrl = baseUrl
  }

  authHeader(idToken) {
    return (config) => {
      config.headers['Authorization'] = `Bearer ${idToken}`
      return config;
    };
  }

  /**
   * Build an axios client
   * @param config configuration
   * @return an instance of axios client configured
   */
  build(config = {baseURL: this._baseUrl , timeout: 5000}) {
    return this._axios.create(config);
  }

  /**
   *
   * @param config
   * @param token
   * @return {*}
   */
  buildAuth(token, config = {baseURL: this._baseUrl , timeout: 5000}) {
    console.log(config)
    const instance = this.build(config)
    instance.interceptors.request.use(this.authHeader(token))
    return instance;
  }

}

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({  Vue  }) => {
  Vue.prototype.$axios = new CustomAxios(axios,Domain.endpoint);
}

