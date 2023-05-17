export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookies = parseCookies(event)
  let res = null

  if (event.node.req.method === 'GET') {
    const query = getQuery(event)

    if (query.receiver) {
      // история чата
      res = await $fetch(`${config.STRAPI_BASE_URL}/messages`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + cookies.jwt },
        params: {
          sort: 'createdAt:desc',
          'filters[$or][0][$and][0][sender_user][$eq]': query.username,
          'filters[$or][0][$and][1][receiver_user][$eq]': query.receiver,
          'filters[$or][1][$and][0][sender_user][$eq]': query.receiver,
          'filters[$or][1][$and][1][receiver_user][$eq]': query.username
        }
      })
        .catch((error) => {
          throw createError({ data: error.data })
        })
      return res.data.map(m => { return {
        id: m.id,
        text: m.attributes.text,
        sent: m.attributes.sender_user === query.username,
        stamp: new Date(m.attributes.createdAt).toLocaleString("ru")
      }})

    } else if (query.username) {
      // список контактов
      res = await $fetch(`${config.STRAPI_BASE_URL}/messages`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + cookies.jwt },
        params: {
          sort: 'createdAt',
          'filters[$or][0][sender_user][$eq]': query.username,
          'filters[$or][1][receiver_user][$eq]': query.username
        }
      })
        .catch((error) => {
          throw createError({ data: error.data })
        })
      return res.data.map(e => e.attributes).reduce((a, e) => {
        if (e.sender_user === query.username) {
          if (!a.includes(e.receiver_user)) a.push(e.receiver_user)
        } else if (!a.includes(e.sender_user)) a.push(e.sender_user)
        return a
      }, [])
    }
  } else if (event.node.req.method === 'POST') {
    const body = await readBody(event)
    // отправка сообщения
    res = await $fetch(`${config.STRAPI_BASE_URL}/messages`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + cookies.jwt },
      body: {
        data: body
      }
    })
      .catch((error) => {
        throw createError({ data: error.data })
      })
    return res
  }
  return null
})
