#!/usr/bin/env node

const PACKAGE = require('../package.json')
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const path = require('path')
const fs = require('fs-extra')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const codeTemplatesAnalyzer = require('./analyzers/codeTemplates')

const resolvePath = require('./resolvePath')

const main = async (configPath, outpath) => {
    outpath = resolvePath(outpath)
    fs.ensureDirSync(outpath)
    const xmlStr = await fs.readFile(resolvePath(configPath), 'utf-8')
    parser.parseString(xmlStr, async (err, xml) => {
        if (err) {
            console.error(err)
            return
        }
        await codeTemplatesAnalyzer(xml, outpath)
        console.log(`Analyze complete. Reports written to: ${outpath}`)
    })
}

const getOptions = (yargs) => {
    yargs
        .positional('mirthConfig', {describe: 'Path to Mirth Connect Backup Config', type: 'string'})
        .positional('outpath', {describe: 'Path to write reports to', type: 'string', default: './reports'})
        .option('log', {alias: 'l', describe: 'write build to log file', type: 'boolean', default: false})
}

yargs(hideBin(process.argv))
    .command(
        'analyze <mirthConfig> [outpath]', 'Analyze Mirth Connect Backup Config',
        getOptions,
        ({mirthConfig, outpath, log}) => {
            main(mirthConfig, outpath).catch(console.error)
        })
    .demandCommand()
    .help('h')
    .alias('h', 'help')
    .argv
