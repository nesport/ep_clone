export const useAdminLinks = () => useState('adminLinks', () => { return [
  { title: 'Пользователи', url: '/admin/clients' },
  { title: 'Настройки', url: '/admin/config' }
] })
