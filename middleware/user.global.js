export default defineNuxtRouteMiddleware(async (to, from) => {
  const { value: user } = useUser()
  if (!user.name) {
    const jwtCookie = useCookie('jwt')
    if (jwtCookie.value) {
      const { data } = await useFetch('/api/auth', { method: 'GET' })
      if (data.value) {
        user.name = data.value.username
        user.email = data.value.email
        user.role = data.value.role ? data.value.role.name : null
      }
    }
  }
})
