const {createLogger, format, config: {syslog}, transports} = require('winston')

class Logger {
    constructor({level = 'error', logFile = 'build.log'} = {}) {
        Object.keys(syslog.levels).forEach(level => this[level] = (args) => this.log(level, args))
        if (this.warning) this.warn = this.warning
        this._logLevel = (syslog.levels[level] < 5) ? 'notice' : level
        this._logger = createLogger({
            levels: syslog.levels,
            level: this._logLevel,
            exitOnError: true,
            format: format.simple(),
            transports: [
                new transports.Console(),
                new transports.File({
                    filename: logFile,
                    json: false,
                    maxsize: 5242880,
                    maxFiles: 5,
                }),
            ]
        })

    }

    log(level, message) {
        if (message instanceof Error) return this._logger[level](`${message.message}\n${message.stack}`)
        this._logger[level](message)
    }

}


const initLogger = ({level = 'error', logFile = 'build.log'} = {}) => {
    if (globalThis.logger) return globalThis.logger
    console.log(`Log Level: ${level}  logFile: ${logFile}`)
    globalThis.logger = new Logger({level})
    return globalThis.logger
}

module.exports = initLogger
