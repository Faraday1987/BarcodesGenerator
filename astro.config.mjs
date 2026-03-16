// @ts-check
import { defineConfig } from 'astro/config';
import path from "node:path";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  adapter: vercel(),
  experimental: {
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
    },
  },
  output: 'static',
  site: 'https://barcodesgenerator.vercel.app',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          es: 'es',
          de: 'de',
        },
      },
    }),
    robotsTxt({
      host: 'barcodesgenerator.vercel.app',
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@src": path.resolve("./src"),
        "@components": path.resolve("./src/components"),
        "@layouts": path.resolve("./src/layouts"),
        "@styles": path.resolve("./src/assets/styles"),
        "@assets": path.resolve("./src/assets"),
        "@i18n": path.resolve("./src/i18n"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "/src/assets/styles/base.scss" as *;`
        }
      }
    }
  },
  base: '/',
  build: {
    assets: 'assets'
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de'],
    routing: {
      prefixDefaultLocale: true,
    },
    fallback: {
      en: 'es',
      de: 'es',
    }
  },
  server: {
    port: 3000,
    host: true
  }
});