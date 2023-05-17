import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (event.node.req.method === 'POST') {
    const body = await readBody(event)
    const receiver = config.SUPPORT_EMAIL
    let transporter = nodemailer.createTransport(config.EMAIL_TRANSPOTER)
    let result = await transporter.sendMail({
      from: '"SL" <slnodetest@rambler.ru>',
      to: receiver,
      subject: 'SL: Обратная связь',
      text: `${body.text}`,
      html:
        `<span style="color: gray">Имя: </span><span>${body.name}</span><br>
        <span style="color: gray">Email: </span><span>${body.email}</span>
        <pre>${body.text}</pre>`,
      attachments: body.image ? [
        { path: body.image }
      ] : null
    })
    if (result.accepted && result.accepted.includes(receiver)) {
      return { sent: true }
    } else {
      throw createError({ statusCode: 400, statusMessage: 'EmailSendError' })
    }
  }
  return null
})
