export default defineNuxtRouteMiddleware((to, from) => {
  const { value: user } = useUser()
  if (user.role) {
    if (user.role === 'Admin') return navigateTo('/admin/clients')
    return navigateTo('/tracking')
  }
})
