export const environment = {
    production: true,
    CLIENT_ID: (window as any).__env?.CLIENT_ID || 'yo1',
    CLIENT_SECRET: (window as any).__env?.CLIENT_SECRET || 'yo2'
}