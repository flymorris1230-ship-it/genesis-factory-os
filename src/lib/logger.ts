import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
})

export type LogContext = {
  requestId: string
  tenantId?: string
  actorId?: string
  path: string
  method: string
  duration_ms?: number
  ok?: boolean
  error?: {
    code: string
    message: string
  }
}
