#!/usr/bin/env bash
mkdir -p dist
./node_modules/.bin/pkg src/index.js --output ./dist/mcAnalyzer --targets node14-win-x64 && zip --junk-paths mcAnalyzer.win.zip ./dist/mcAnalyzer.exe
./node_modules/.bin/pkg src/index.js --output ./dist/mcAnalyzer --targets node14-linux-x64 && zip --junk-paths mcAnalyzer.linux.zip ./dist/mcAnalyzer
./node_modules/.bin/pkg src/index.js --output ./dist/mcAnalyzer --targets node14-mac-x64 && zip --junk-paths mcAnalyzer.mac.zip ./dist/mcAnalyzer
#sleep 30