function no_indent_logger(console_log) {
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

/* Installation
<script src="./path-to-vendor/vendor/no_indent_logger/in-browser.js"></script>
<script>
    // Replace console.log
    console.log = no_indent_logger(console.log)

    // As logger
    const logger = no_indent_logger(console.log)
</script>

*/