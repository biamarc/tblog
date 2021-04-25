/**
 * Setup custom directive and filter used by project
 * @param Vue
 * @return {Promise<void>}
 */
export default async ( { Vue }) => {
  Vue.filter('truncate', function (value, length=100){
    if (!value) return value
    if (length<=0 || length>=value.length) return value
    return value.substring(0,length)+'...'
  })
}
