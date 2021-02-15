const fs = require('fs-extra')
const path = require('path')
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const codeTemplatesAnalyzer = require('./analyzers/codeTemplates')

const resolvePath = (pathString) => path.resolve(process.cwd(), pathString)

module.exports = async (configPath) => {
    const xmlStr = await fs.readFile(resolvePath(configPath), 'utf-8')
    parser.parseString(xmlStr, function (err, xml) {
        codeTemplatesAnalyzer(xml)
        // const {serverConfiguration} = result
        // const {codeTemplateLibraries: [codeTemplateLibraries]} = serverConfiguration
        // codeTemplateLibraries.codeTemplateLibrary?.forEach(codeTemplateLibrary => handleCodeTemplates(codeTemplateLibrary))
        //
        // const {channels: [channels]} = serverConfiguration
        // channels.channel.forEach((channel) => {
        //     // reset()
        //     handleChannel(channel)
        // })
        // console.log('Done')
    })
}
