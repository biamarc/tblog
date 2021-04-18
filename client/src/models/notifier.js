import { Notify } from 'quasar'

/**
 * Custom class for notification
 */
export default class Notifier {
  constructor (options = {timeout: 3000, position: 'bottom'}) {
    this.options = options
  }
  success (message = 'Success') {
    Notify.create({
      message: message,
      type: 'positive',
      ...this.options
    })
  }

  error (message = 'Fail') {
    Notify.create({
      message: message,
      type: 'negative',
      // position: this.options.position,
      // timeout: this.options.timeout
      ...this.options
    })
  }

  warning (message = 'Warning') {
    Notify.create({
      message: message,
      type: 'warning',
      ...this.options
    })
  }

  info (message = 'Info') {
    Notify.create({
      message: message,
      type: 'info',
      ...this.options
    })
  }

  alert (message = 'Alert') {
    Notify.create({
      message: message,
      ...this.options
    })
  }
}
