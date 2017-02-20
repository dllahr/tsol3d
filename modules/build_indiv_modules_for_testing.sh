#!/bin/bash

~/node_modules/.bin/webpack buildUtils.js ../build/assembledBuildUtils.js --output-library 'abu'

~/node_modules/.bin/webpack biochemStyling.js ../build/assembledBiochemStyling.js --output-library 'abios'
