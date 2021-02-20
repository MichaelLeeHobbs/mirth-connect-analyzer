const csvToMarkdown = require('csv-to-markdown-table')
const fs = require('fs-extra')

const ctByChan = fs.readFileSync('./reports/CodeTemplateReport.csv', 'utf-8').split('\r\n')
const rows = []
for (let i = 0; i < 4; i++) {
    rows.push(ctByChan[i])
}
console.log(rows)
console.log(csvToMarkdown(rows.join('\n'), ",", true))
