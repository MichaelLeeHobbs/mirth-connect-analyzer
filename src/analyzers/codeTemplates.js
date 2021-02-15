const fs = require('fs-extra')
const resolvePath = require('../resolvePath')

const javaScriptStep = "com.mirth.connect.plugins.javascriptstep.JavaScriptStep"
const functionRegex = /function\s+(?<functionName>\w+)\(/
const arrowFunctionConstRegex = /const\s+(?<functionName>\w+)\s*=\s*\(.*\)\s*=>/
const arrowFunctionVarRegex = /var\s+(?<functionName>\w+)\s*=\s*\(.*\)\s*=>/
const arrowFunctionPropRegex = /(?<functionName>\w+)\s*:\s*\(.*\)\s*=>/


const codeTemplateFunctions = new Map()
const codeTemplateFunctionsUsages = [
    ['channelName', 'channelID', 'transformerType', 'transformerStep', 'transformerName', 'transformerLine', 'functionName', 'templateLibraryName', 'templateName', 'matcher', 'line'],
]

const addUsage = ({channelName, channelID, transformerType = '-', transformerStep = '-', transformerName, transformerLine, functionName, templateLibraryName, templateName, matcher, line}) => {
    //                                  'channelName',      'channelID',        'transformerType',      'transformerStep',      'transformerName',      'transformerLine', 'functionName', 'templateLibraryName', 'templateName', 'matcher', 'line'
    codeTemplateFunctionsUsages.push([String(channelName), String(channelID), String(transformerType), String(transformerStep), String(transformerName), String(transformerLine), String(functionName), String(templateLibraryName), String(templateName), String(matcher), String(line)])
}

const csvField = (v) => `"${v}"`
const codeTemplateFunctionsReport = (outpath) => {
    const report = [
        ['functionName', 'templateLibraryName', 'templateName', 'used', 'enabledChannelIds'],
    ]
    codeTemplateFunctions.forEach((v, k) => {
        v.templates.forEach(({templateLibraryName, templateName, used = false, enabledChannelIds}) => {
            report.push([k, templateLibraryName, templateName, used, enabledChannelIds.join(',')].map(csvField))
        })
    })
    const csv = report.map(row => row.join(',')).join('\r\n')
    fs.writeFileSync(resolvePath(`${outpath}/CodeTemplateChannelUsageReport.csv`), csv)
}

const codeTemplateUsageReport = (outpath) => {
    const csv = codeTemplateFunctionsUsages.map(row => row.join(',')).join('\r\n')
    fs.writeFileSync(resolvePath(`${outpath}/CodeTemplateUsageReport.csv`), csv)
}

const reset = () => codeTemplateFunctions.clear()


const addCodeTemplateFunction = ({functionName, templateID, templateName, enabledChannelIds = [], id, name}) => {
    const JS_KEY_WORDS = ["await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "package", "private", "protected", "public", "return", "super", "switch", "static", "this", "throw", "try", "true", "typeof", "var", "void", "while", "with", "yield"]
    const ignoreList = ['split', 'replace', 'toString', 'keys', 'forEach', 'set', 'get']
    if (JS_KEY_WORDS.includes(functionName)) return
    if (ignoreList.includes(functionName)) return
    enabledChannelIds = enabledChannelIds.map(ele => ele.trim())
    const key = `${name}->${functionName}`
    const value = {key, templateLibraryID: id, templateLibraryName: name, functionName, templateID, templateName, enabledChannelIds}
    const data = codeTemplateFunctions.get(functionName) || {templates: new Map()}
    data.templates.set(key, value)
    codeTemplateFunctions.set(functionName, data)
}

// options = {templateID, templateName, enabledChannelIds}
const handleTemplateScript = (script, options) => {
    script.split('\n').forEach(line => {
        let matches = functionRegex.exec(line)
        if (matches) {
            options.functionName = matches.groups.functionName
            addCodeTemplateFunction(options)
        }
        matches = arrowFunctionConstRegex.exec(line)
        if (matches) {
            options.functionName = matches.groups.functionName
            addCodeTemplateFunction(options)
        }
        matches = arrowFunctionVarRegex.exec(line)
        if (matches) {
            options.functionName = matches.groups.functionName
            addCodeTemplateFunction(options)
        }
        matches = arrowFunctionPropRegex.exec(line)
        if (matches) {
            options.functionName = matches.groups.functionName
            addCodeTemplateFunction(options)
        }
    })

}
const handleCodeTemplate = ({codeTemplate, enabledChannelIds, id, name}) => {
    const {id: [templateID], name: [templateName], properties: [{type: [templateType], code: [code]} = properties]} = codeTemplate
    handleTemplateScript(code, {templateID, templateName, enabledChannelIds, id, name})
}

const handleCodeTemplates = (codeTemplateLibrary) => {
    const {id: [id], name: [name], enabledChannelIds: [{string: enabledChannelIds} = _ids], codeTemplates: [codeTemplates]} = codeTemplateLibrary
    codeTemplates.codeTemplate.forEach(codeTemplate => handleCodeTemplate({codeTemplate, enabledChannelIds, id, name}))
}

const checkScript = ({script, channelName, channelID, transformerType, transformerStep, transformerName}) => {
    transformerName = transformerName || transformerType
    channelID = String(channelID)

    codeTemplateFunctions.forEach((templateData, functionName) => {
        const funcUseRegex = new RegExp(`[^.\\w]*${functionName}\\s*\\(`, '')
        const funcAssignmentRegex = new RegExp(`[=]\\s*${functionName}[\\s|;]`)

        script.split('\n').forEach((line, i) => {
            const matchA = funcUseRegex.exec(line)
            const matchB = funcAssignmentRegex.exec(line)
            const match = matchA || matchB
            if (match) {
                templateData.templates.forEach(template => {
                    if (template.enabledChannelIds.includes(channelID)) {
                        template.used = true
                        const matcher = matchA || matchB
                        const {templateLibraryName, templateName} = template
                        addUsage({channelName, channelID, functionName, templateLibraryName, templateName, transformerType, transformerStep, transformerName, transformerLine: i + 1, matcher, line})
                    }
                })
            }

        })
    })
}

// todo rename step to steps or something better
const handleStep = ({step, channelName, channelID, transformerType, transformerStep}) => {
    if (!step[javaScriptStep]) return

    const steps = step[javaScriptStep]
    steps.forEach(step=>{
        const transformerName = `${step.name?.[0] || ''}`
        const {script: [script]} = step
        checkScript({script, channelName, channelID, transformerType, transformerStep, transformerName})
    })

}

const handleTransformer = ({transformer, channelName, channelID, transformerType}) => {
    try {
        transformer.elements.forEach((step, i) => {
            handleStep({step, channelName, channelID, transformerType, transformerStep: i + 1})
        })
    } catch (e) {
        console.error('handleTransformer failed on', transformer)
    }
}

const handleChannel = (channel) => {
    const {name: [channelName]} = channel
    const {id: [channelID]} = channel

    const [sourceConnector] = channel.sourceConnector
    const [sourceTransformer] = sourceConnector.transformer
    const destinationConnectors = channel.destinationConnectors[0]
    const preprocessingScript = channel.preprocessingScript[0]
    const postprocessingScript = channel.postprocessingScript[0]
    const deployScript = channel.deployScript[0]
    const undeployScript = channel.undeployScript[0]

    checkScript({script: preprocessingScript, channelName, channelID, transformerType: 'preprocessingScript'})
    checkScript({script: postprocessingScript, channelName, channelID, transformerType: 'postprocessingScript'})
    checkScript({script: deployScript, channelName, channelID, transformerType: 'deployScript'})
    checkScript({script: undeployScript, channelName, channelID, transformerType: 'undeployScript'})

    handleTransformer({transformer: sourceTransformer, channelName, channelID, transformerType: 'source'})
    destinationConnectors.connector.forEach(connector => {
        connector.transformer.forEach(transformer => {
            handleTransformer({transformer, channelName, channelID, transformerType: 'destination'})
        })
        connector.responseTransformer.forEach(transformer => handleTransformer({transformer, channelName, channelID, transformerType: 'destinationResponseTransformer'}))
    })

}

module.exports = async (xml, outpath) => {
    const {serverConfiguration} = xml
    const {codeTemplateLibraries: [codeTemplateLibraries]} = serverConfiguration
    codeTemplateLibraries.codeTemplateLibrary?.forEach(codeTemplateLibrary => handleCodeTemplates(codeTemplateLibrary))

    const {channels: [channels]} = serverConfiguration
    channels.channel.forEach((channel) => handleChannel(channel))

    codeTemplateUsageReport(outpath)
    codeTemplateFunctionsReport(outpath)
}
