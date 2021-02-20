const {writeToPath }  = require('fast-csv')
const resolvePath = require('../tools/resolvePath')


const writeCSV = ({rows, outPath, fileName}) => {
    const outFile = resolvePath(`${outPath}/${fileName}.csv`)
    writeToPath(outFile, rows)
        .on('error', err => console.error(`Failed to write CSV file: ${outFile}`, err))
        .on('finish', () => console.log(`Wrote: ${outFile}`))
}

module.exports = writeCSV