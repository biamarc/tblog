// deployed AWS zone
const zoneId = 'eu-south-1';
// rest api id
const apiId = 'r417ylgl35';
// web socket id
const wssId = '6fd4dobiu7'
export default   {
    endpoint: `https://${apiId}.execute-api.${zoneId}.amazonaws.com/dev/`,
    wss: `wss://${wssId}.execute-api.${zoneId}.amazonaws.com/dev`
}
