import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  nitro: {
    preset: 'vercel',
  },
  modules: ['@primevue/nuxt-module'],
    primevue: {
        options: {
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: ".p-dark",
                }
            },
            ripple: true
        },
        autoImport: true
    },
  css: [
   /* '~/assets/global.scss',*/
	'@/assets/css/tailwind.css'
    
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    '/': { ssr: true, static: false } // this avoids the localhost build-time fetch issue
  },
  runtimeConfig: {
    dbHost: 'localhost',
    dbPort: 5432,
    dbName: 'products_db',
    dbUser: 'zach',
    dbPassword: 'admin',
	databaseUrl:process.env.DEV_NUXT_DATABASE_URL
  },
  compatibilityDate: '2025-01-18',
});