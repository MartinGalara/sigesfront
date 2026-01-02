/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  // Agregar más variables de entorno aquí según necesidad
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
