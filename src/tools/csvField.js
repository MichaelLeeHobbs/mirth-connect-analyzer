const csvField = (v) => {
    // `"${String(v).startsWith('=') ? "'" : ""}${v}"`
    let str = String(v).trim()
    if (str.startsWith('=')) str = str.replace(/^=+/, '').trim()
    if (str.includes(',')) return `"${str}"`
    return str
}
module.exports = csvField