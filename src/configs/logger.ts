import { createLogger, transports, format, Logger, } from 'winston';
import { TransformableInfo } from 'logform';
import util from 'util'

const myformat= (label: string) => format.combine(
    format.label({ label: '['+label+']' }),
    format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    format.printf((info: TransformableInfo) => `${info.timestamp} [${info.level}]: ${info.label} ${util.format('%o', info.message)}`),
)

export const logger = (logPath: string | undefined, label: string, level: string) : Logger => {
    let filepath
    if(logPath !== undefined) {
        return createLogger({
            transports: [
                new transports.File(
                    {
                    filename: filepath +'/error.log',
                    level: level,
                    format:  myformat(label)
                    }
                ),
            ]
        })
    } else {
        return createLogger({
            transports: [
                new transports.Console({
                    level: level,
                    format: myformat(label)
                })
            ]
        })
    }

};