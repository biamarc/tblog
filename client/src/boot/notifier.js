import Notifier from "src/models/notifier";

export default async ( { Vue }) => {
  Vue.prototype.$notifier= new Notifier()
}
