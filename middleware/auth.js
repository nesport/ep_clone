export default defineNuxtRouteMiddleware(async (to, from) => {
  const { value: user } = useUser()
  if (!user.name) {
    return navigateTo('/login')
  }
})
