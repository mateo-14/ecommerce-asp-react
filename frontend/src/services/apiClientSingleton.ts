import { HTTPClient } from './HttpClient'

// Http client singleton to use own rest api
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
const client = new HTTPClient(apiBaseUrl)

export { client }
