const writeCSV = require('../tools/writeCSV')

const listeners = [
    // ['channelName', 'channelID', 'host', 'port', 'serverMode']
]

const addListener = ({
                         channelName, channelID, host, port, serverMode, remoteAddress, remotePort, overrideLocalBinding, reconnectInterval, receiveTimeout, bufferSize, maxConnections, keepConnectionOpen, dataTypeBinary,
                         charsetEncoding, respondOnNewConnection, responseAddress, responsePort
}) => listeners.push([channelName, channelID, serverMode, host, port, remoteAddress, remotePort, overrideLocalBinding, reconnectInterval, receiveTimeout, bufferSize, maxConnections, keepConnectionOpen, dataTypeBinary, charsetEncoding, respondOnNewConnection, responseAddress, responsePort])

// add the header this way to make it easier to reorder the columns
addListener({
    channelName: 'channelName', channelID: 'channelID', host: 'host', port: 'port', serverMode: 'serverMode', remoteAddress: 'remoteAddress', remotePort: 'remotePort', overrideLocalBinding: 'overrideLocalBinding',
    reconnectInterval: 'reconnectInterval', receiveTimeout: 'receiveTimeout', bufferSize: 'bufferSize', maxConnections: 'bufferSize', keepConnectionOpen: 'keepConnectionOpen', dataTypeBinary: 'dataTypeBinary',
    charsetEncoding: 'charsetEncoding', respondOnNewConnection: 'respondOnNewConnection', responseAddress: 'responseAddress', responsePort: 'responsePort'
})

module.exports = async (xml, outPath) => {
    const {serverConfiguration} = xml
    const {codeTemplateLibraries: [codeTemplateLibraries]} = serverConfiguration
    // codeTemplateLibraries.codeTemplateLibrary?.forEach(codeTemplateLibrary => handleCodeTemplates(codeTemplateLibrary))

    const {channels: [channels]} = serverConfiguration
    channels.channel.forEach((channel) => {
        const {id: [channelID], name: [channelName], sourceConnector: [sourceConnector]} = channel
        console.log(`Processing Channel: ${channelName}`)
        const {properties: [properties]} = sourceConnector
        const connectorType = properties['$'].class?.split('.').pop()
        // todo handle HttpReceiverProperties
        const ignoreTypes = ['VmReceiverProperties', 'FileReceiverProperties', 'JavaScriptReceiverProperties', 'HttpReceiverProperties']
        // FileReceiverProperties
        // JavaScriptReceiverProperties
        if (ignoreTypes.includes(connectorType)) return
        // if (!properties) {
        //     console.log(`Processing Channel: ${channelName}  properties: undefined  ConnectorType: ${connectorType}`)
        //     return
        // }
        // console.log(connectorType, properties)
        const {
            listenerConnectorProperties: [listenerConnectorProperties],
            serverMode: [serverMode], remoteAddress: [remoteAddress], remotePort: [remotePort], overrideLocalBinding: [overrideLocalBinding],
            reconnectInterval: [reconnectInterval], receiveTimeout: [receiveTimeout], bufferSize: [bufferSize], maxConnections: [maxConnections], keepConnectionOpen: [keepConnectionOpen], dataTypeBinary: [dataTypeBinary],
            charsetEncoding: [charsetEncoding], respondOnNewConnection: [respondOnNewConnection], responseAddress: [responseAddress], responsePort: [responsePort]
        } = properties

        const {host: [host], port: [port]} = listenerConnectorProperties
        addListener({
            channelName, channelID, host, port, serverMode, remoteAddress, remotePort, overrideLocalBinding, reconnectInterval, receiveTimeout, bufferSize, maxConnections, keepConnectionOpen, dataTypeBinary,
            charsetEncoding, respondOnNewConnection, responseAddress, responsePort
        })
        console.log(connectorType, properties)
    })
    // console.log(listeners)
    writeCSV({rows: listeners, outPath, fileName: 'listeners'})

}
