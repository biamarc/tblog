import axios from 'axios'
import Domain  from '../models/domain'
function authHeader(config, idToken){
  config.headers['Authorization'] = `Bearer ${idToken}`
}

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({  Vue  }) => {
  Vue.prototype.$axios = axios.create({
    baseURL: Domain.endpoint,
    timeout: 5000
  });
}

export {authHeader}
