export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookies = parseCookies(event)
  let res = null

  if (event.node.req.method === 'GET') {
    const query = getQuery(event)

    if (query.data === 'config') {
      // параметры
      res = await $fetch(`${config.STRAPI_BASE_URL}/configuration`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + cookies.jwt },
        params: {
          populate: 'logo'
        }
      })
        .catch((error) => {
          throw createError({ data: error.data })
        })
      return res.data ? res.data.attributes : {}
    } else if (query.data === 'users') {
      // пользователи
      res = await $fetch(`${config.STRAPI_BASE_URL}/users`, {
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
    } else if (query.data === 'roles') {
      // роли
      res = await $fetch(`${config.STRAPI_BASE_URL}/users-permissions/roles`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + cookies.jwt }
      })
        .catch((error) => {
          throw createError({ data: error.data })
        })
      return res.roles
    }
  } else if (event.node.req.method === 'POST') {
    const body = await readBody(event)
    if (body.userId) {
      // редактирование пользователя
      res = await $fetch(`${config.STRAPI_BASE_URL}/users/${body.userId}`, {
        method: "PUT",
        headers: {"Authorization": "Bearer " + cookies.jwt},
        body: {
          [body.field]: body.value
        }
      })
        .catch((error) => {
          throw createError({data: error.data})
        })
      if (res.id) {
        return { notifyMessage: 'Сохранено' }
      } else {
        throw createError({ statusCode: 400, statusMessage: 'saveError' })
      }
    } else if (body.data) {
      // редактирование параметров
      res = await $fetch(`${config.STRAPI_BASE_URL}/configuration`, {
        method: "PUT",
        headers: {"Authorization": "Bearer " + cookies.jwt},
        body: {
          data: body.data
        }
      })
        .catch((error) => {
          throw createError({data: error.data})
        })
      if (res.data && res.data.id) {
        return { notifyMessage: 'Сохранено' }
      } else {
        throw createError({ statusCode: 400, statusMessage: 'saveError' })
      }
    }
  }
  return null
})
