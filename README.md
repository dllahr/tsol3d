## TSOL3D System Maintenance Guide ##


### TODO ###
* get 3DMol into webpack
* get defalt 3DMol colors into tsol3d defaults

### Building the library ###
command to build webpack: (from modules directory)
```
~/node_modules/.bin/webpack tsol3d.js  ../build/assembledTsol3d.js --output-library '$tsol3d'
```
can add ```--optimize-minimize``` to generate minimized / optimized version

dev mode for build - monitor files and rebuild when they are saved:
```
~/node_modules/.bin/webpack tsol3d.js  ../build/assembledTsol3d.js --output-library '$tsol3d'  --progress --watch
```
