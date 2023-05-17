import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  let res = null

  if (event.node.req.method === 'POST') {
    const body = await readBody(event)
    if (body.login) {
      // аутентификация
      res = await $fetch(`${config.STRAPI_BASE_URL}/auth/local`, {
        method: "POST",
        body: {
          identifier: body.login,
          password: body.password
        }
      })
        .catch((error) => {
          throw createError({ data: error.data })
        })
      return res
    } else if (body.name) {
      // регистрация
      const receiver = config.REGISTERATION_EMAIL
      let transporter = nodemailer.createTransport(config.EMAIL_TRANSPOTER)
      let result = await transporter.sendMail({
        from: '"SL" <slnodetest@rambler.ru>',
        to: receiver,
        subject: 'SL: Заявка на регистрацию',
        text: `Название компании: ${body.companyName}`,
        html:
          `<p><b>Заявка на регистрацию</b></p>
          <span style="color: gray">Имя: </span><span>${body.name}</span><br>
          <span style="color: gray">Фамилия: </span><span>${body.surname}</span><br>
          <span style="color: gray">Название компании: </span><span>${body.companyName}</span><br>
          <span style="color: gray">ИНН компании: </span><span>${body.companyINN}</span><br>
          <span style="color: gray">Email: </span><span>${body.email}</span>`
      })
      if (result.accepted && result.accepted.includes(receiver)) {
        return { sent: true }
      } else {
        throw createError({ statusCode: 400, statusMessage: 'EmailSendError' })
      }
    }
  } else if (event.node.req.method === 'GET') {
    const cookies = parseCookies(event)
    // восстановление сессии
    res = await $fetch(`${config.STRAPI_BASE_URL}/users/me`, {
      method: "GET",
      headers: { "Authorization": "Bearer " + cookies.jwt },
      params: {
        populate: 'role'
      }
    })
      .catch((error) => {
        throw createError({ data: error.data })
      })
    return res

  }
  return null
})
