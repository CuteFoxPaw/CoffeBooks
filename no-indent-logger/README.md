# No Indent Logger

## Installation

### Commonjs (Node)
```js
// Replace console.log
console.log = require('./path-to-vendor/vendors/no-indent-logger')(console.log)

// As logger
const logger = require('./path-to-vendor/vendors/no-indent-logger')(console.log)
```

### For in-browser

```html
<script src="./path-to-vendor/vendors/no-indent-logger/in-browser.js"></script>
<script>
    // Replace console.log
    console.log = no_indent_logger(console.log)

    // As logger
    const logger = no_indent_logger(console.log)
</script>
```

## Usage

```js
/* ---- Before ---- */
function annoying() {
    console.log(`
        Indented line
    `);
}
annoying();
/* Output: 
        Indented line
*/

// ---- After ---- */
function great() {
    console.log(`
        Not indented line
    `);
}
great();
/* Output: 
Not indented line
*/
```