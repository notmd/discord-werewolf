import { format } from 'date-fns'
import winston from 'winston'

export const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.printf(
    (log) =>
      `[${log.level.toUpperCase()}] ${format(Date.now(), 'hh:mm:ss')} - ${
        log.message
      }`
  ),
})
