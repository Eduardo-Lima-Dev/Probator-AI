import { apiRequest } from './httpClient'

export type HealthResponse = {
  status: string
  message: string
  timestamp: string
  environment: string
}

export async function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health')
}
