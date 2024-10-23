export const environment = {
    production: false,
    FRONTEND_BASE_URL: (window as any).__env?.FRONTEND_BASE_URL || 'frontendbaseurl',
    CLIENT_ID: (window as any).__env?.CLIENT_ID || 'clientid',
    CLIENT_SECRET: (window as any).__env?.CLIENT_SECRET || 'clientsecret'
}