# Mirth Connect Analyzer
## Reports
### Listeners
Listing of each channel that listens for an incoming connection.
| channelName                 | channelID                            | serverMode  | host    | port  | remoteAddress | remotePort | overrideLocalBinding | reconnectInterval | receiveTimeout | bufferSize | bufferSize | keepConnectionOpen | dataTypeBinary | charsetEncoding  | respondOnNewConnection | responseAddress | responsePort |
| --------------------------- | ------------------------------------ | ----------- | ------- | ----- | ------------- | ---------- | -------------------- | ----------------- | -------------- | ---------- | ---------- | ------------------ | -------------- | ---------------- | ---------------------- | --------------- | ------------ |
| 10001 ORM Jonny Radiology   | 12903f52-307a-4a14-8196-98c50ba8d6ef | TRUE        | 0.0.0.0 | 10001 |               |            | FALSE                | 5000              | 0              | 65536      | 50         | FALSE              | FALSE          | DEFAULT_ENCODING | 0                      |                 |              |
| 10003 ORM Lake No Where     | 012f47a9-1974-4050-acf9-3afa182297f8 | TRUE        | 0.0.0.0 | 10003 |               |            | FALSE                | 5000              | 0              | 65536      | 10         | FALSE              | FALSE          | DEFAULT_ENCODING | 0                      |                 |              |
| 10006 ORM Mikes Associates  | f243bfcd-b46d-46d8-9e7b-1c8b46987a38 | TRUE        | 0.0.0.0 | 10006 |               |            | FALSE                | 5000              | 0              | 65536      | 10         | FALSE              | FALSE          | DEFAULT_ENCODING | 0                      |                 |              |

### CodeTemplateByChannelUsage
Listing of possible code template usages with where they are used and which template function is used.
| channelName                 | channelID                            | transformerType | transformerStep | transformerName | transformerLine | functionName       | templateLibraryName | templateName   | matcher             | line                             |
|-----------------------------|--------------------------------------|-----------------|-----------------|-----------------|-----------------|--------------------|---------------------|----------------|---------------------|----------------------------------|
| 10001 ORM Jonny Radiology   | 12903f52-307a-4a14-8196-98c50ba8d6ef | destination     | 1               | Mapper/Writer   | 147             | RamSoftORM_O01     | rad  - Deprecated   | RamSoftORM_O01 | RamSoftORM_O01(     | "RamSoftORM_O01(orderData, tmp)" |
| 10003 ORM Lake No Where     | 012f47a9-1974-4050-acf9-3afa182297f8 | destination     | 1               | destination     | 155             | RamSoftORM_O01     | rad  - Deprecated   | RamSoftORM_O01 | RamSoftORM_O01(     | "RamSoftORM_O01(orderData, tmp)" |
| 10006 ORM Mikes Associates  | f243bfcd-b46d-46d8-9e7b-1c8b46987a38 | deployScript    | -               | deployScript    | 4               | globalDeployScript | GlobalScripts       | DeployScript   | globalDeployScript( | globalDeployScript()             |

### CodeTemplateReport
Listing of each code template function and if it appears to be used.
| functionName             | templateLibraryName             | templateName             | used  | enabledChannelIds                    |
|--------------------------|---------------------------------|--------------------------|-------|--------------------------------------|
| name                     | Advocate                        | AdvocateHL7Generator     | false | 6b1d95db-c06b-43a0-95be-18a5e4521e7b |
| hl7Advocate_1_0_0        | Advocate                        | AdvocateHL7Generator     | false | 6b1d95db-c06b-43a0-95be-18a5e4521e7b |
| ramSoftARHToAdvocateJSON | Appalachian Regional Healthcare | ramSoftARHToAdvocateJSON | true  | 7ca4640c-aa07-47d8-8fe3-247c54b2e08a |

## Install
### Download Binary 
1. https://github.com/MichaelLeeHobbs/mirth-connect-analyzer/releases
2. Pick the version for your OS
3. Unzip
4. (Optional) add to path

### From Source
1. `git clone https://github.com/MichaelLeeHobbs/mirth-connect-analyzer.git`
2. `yarn install` or `npm install`

### From npm
* todo `npm install -g mirth-connect-analyzer@latest`
* todo `yarn global add mirth-connect-analyzer@latest`

## Usage
### From Download/NPM install
1. In Mirth Connect go to Settings > Backup Config
2. Then from CLI run `mcAnalyzer analyze path/to/Mirth/Backup.xml [path/to/report/fold]` Path to report folder is optional and defaults to ./reports
3. Example `mcAnalyzer analyze ./MirthBackup.xml`
4. After the analyzer finish check the report's folder.

### From Source
1. In Mirth Connect go to Settings > Backup Config
2. Then from CLI run `node src/index path/to/Mirth/Backup.xml [path/to/report/fold]` Path to report folder is optional and defaults to ./reports
3. Example `node src/index analyze ./MirthBackup.xml`
4. After the analyzer finish check the report's folder.

## Changes
### v0.1.5
* Fixed Report names
* Fixed csv generation - escape each cell to avoid encoding issues
* Fixed csv generation - #NAME? when starts with =
* Fixed matching commented out code
* Fixed invalid matches ie function "n" matching ".toJson"
* Added new report: listeners.csv which list all the channels with host/port of listeners
* Updated Readme

## Todo
* Add license
* Publish to NPM

