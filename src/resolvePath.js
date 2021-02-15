const path = require('path')
const resolvePath = (pathString) => path.resolve(process.cwd(), pathString)

module.exports = resolvePath
