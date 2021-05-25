module.exports = function logger(console_log) {
    return function (...args) {
        const new_args = args.map((arg) => {
            if (typeof arg == 'string') {
                return arg.replace(/\n +/g,'\n').trim()
            }
            return arg
        })
        console_log(...new_args)
    }
}

/* Usage

// Replace console.log
console.log = require('./path/to/vendor/no_indent_logger')(console.log)

// as log
const log = require('./path/to/vendor/no_indent_logger')(console.log)

*/