export const environment = {
    production: true,
    CLIENT_ID: (window as any).__env?.CLIENT_ID || 'hey',
    CLIENT_SECRET: (window as any).__env?.CLIENT_SECRET || 'hey2'
}