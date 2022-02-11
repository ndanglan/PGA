export const ACCESS_TOKEN_KEY: string = "token";

export const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export const APIHost = development ? '/api' : 'https://google.com'