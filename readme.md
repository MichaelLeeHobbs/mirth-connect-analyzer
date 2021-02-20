# Mirth Connect Analyzer
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

