import { Notify, Loading } from 'quasar'

const eText = {
  ValidationError: 'Неверные данные',
  EmailSendError: 'Не удалось отправить',
  saveError: 'Не удалось сохранить'
}

export const apiFetch = async (request, opts) => {
  Loading.show({
    spinnerColor: 'grey-7',
    backgroundColor: 'white'
  })
  const res = await useFetch(request, {
    ...opts
  })
  Loading.hide()
  let message = null
  if (res.error.value) {
    if (res.error.value.data.data) {
      if (res.error.value.data.data.error) {
        message = res.error.value.data.data.error.name
      } else {
        message = res.error.value.data.data.statusMessage
      }
    } else {
      message = res.error.value.statusMessage
    }
    Notify.create({
      type: 'negative',
      position: 'top',
      message: 'Ошибка: ' + (eText[message] || message)
    })
   return null
  } else if (res.data.value) {
    if (res.data.value.notifyMessage) {
      Notify.create({
        type: 'positive',
        position: 'top',
        message: res.data.value.notifyMessage
      })
    }
    return res.data.value
  }
  return null
}
