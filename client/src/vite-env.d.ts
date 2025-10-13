/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TYPEFORM_URL: string
  readonly VITE_DISPLAY_SECONDS: string
  readonly VITE_KIOSK_TITLE: string
  readonly VITE_SERVER_URL: string
  readonly VITE_BRAND_PRIMARY: string
  readonly VITE_BRAND_ACCENT: string
  readonly VITE_BRAND_BG: string
  readonly VITE_BRAND_TEXT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

