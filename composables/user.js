export const useUser = () => useState('user', () => { return {
  name: null,
  email: null,
  role: null
} })
