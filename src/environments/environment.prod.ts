export const environment = {
    production: true,
    FRONTEND_BASE_URL: (window as any).__env?.FRONTEND_BASE_URL || 'prodfrontendbaseurl',
    CLIENT_ID: (window as any).__env?.CLIENT_ID || 'prodclientid',
    CLIENT_SECRET: (window as any).__env?.CLIENT_SECRET || 'prodclientsecret'
}