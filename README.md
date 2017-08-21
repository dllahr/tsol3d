## TSOL3D System Maintenance Guide ##

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

### setting up the development environment ###

0. install git, setup github account
0. install node (tested with version 7.4.0)
0. check out the code from github
  ```git clone git@github.com:dllahr/tsol3d.git```
0. from a terminal / command line, cd into where you cloned the above and do the following from there
0. install http-server with npm
  ```npm install -g http-server```
0. run the http server:
  ```http-server .```
0. try things out:
    1. open http://127.0.0.1:8080 in your browser
    1. navigate to "tests", then choose e.g. "test_TIM_6mer_fragment_A73_I78.html"
    1. try to rotate, zoom, click the buttons etc.
0. install webpack
  ```npm install -g webpack```
0. run webpack in development mode (it will monitor for file changes and rebuild the library):
    1. cd into the "modules" subdirectory
    1. run webpack:
    1. ```~/node_modules/.bin/webpack tsol3d.js  ../build/assembledTsol3d.js --output-library '$tsol3d'  --progress --watch```
0. try it out:  
    1. edit the file modules/tim6merFragmentA73I78.js, change one of the entries in the line that assigns "button_values" e.g. "stick" to "stick hello world"
    1. notice that in the terminal where you ran the webpack command it has produced some output indicating the changed file it noticed, and that the new library was produced
    1. refresh the browser (make sure caching is off), notice that the button text you edited has changed (e.g. from "stick" to "stick hello world")


### using the simple template ###
In this example we'll make a rendering of the structure of glucose.

0. create new module
    1. in modules, copy simpleTemplate.js to glucose.js
    1. rename the module in the file - do a find / replace of simpleTemplate --> glucose
0. add the structure pdb file to data directory (in this case, added glucose.pdb)
0. reference the new module in tsol3d.js - edit tsol3d.js (also in modules directory)
    1. copy all simpleTemplate or simple_template entries and make an analogous entry for glucose
        1. e.g. "import glucose from './glucose'"
        1. export const export_glucose = glucose;
        1. etc.
        1. important note:  when editing the builderMap to add an entry, need to add a comma to the end of the previous line
0. create the test
    1. in tests, copy test_simple_template.html to test_glucose.html
    1. edit the ```<h2>``` (header level 2) line to say "Glucose" instead of "Simple Template"
    1. edit the line in the script that calls $tsol3d
         1. change it to call ```export_glucose``` instead of ```export_simpleTemplate```
         1. change the location of the data to be ```../data/glucose.pdb```
0. try it out in your local browser
0. if it is working, add it to your git repo / github repository
    1. check which files were modified:  ```git status```
        1. should be modules/tsol3d.js
        1. untracked should be:
            1. modules/glucose.js
            1. tests/test_glucose.html
    1. update your repository
        1. ```git fetch```
        1. ```git pull```
    1. add files to be committed
        1. ```git add modules/glucose.js```
        1. ```git add tests/test_glucose.html```
        1. ```git add modules/tsol3d.js```
    1. commit:  ```git commit -m "added view of glucose"```
        * (with a message relevant to the view you've added)
    1. push to github:  ```git push```
