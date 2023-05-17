// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        STRAPI_BASE_URL: null,
        EMAIL_TRANSPOTER: null,
        public: {
            MEDIA_UPLOADS: null,
        }
    },
    modules: [
        'nuxt-quasar-ui'
    ],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/css/_colors.scss" as *;'
                }
            }
        }
    },
    quasar: {
        plugins: ['Notify', 'Loading'],
        extras: {
            fontIcons: ['material-icons']
        },
        sassVariables: "@/assets/css/_colors.scss"
    }
})
