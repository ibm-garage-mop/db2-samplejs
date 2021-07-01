![Nodejs version](https://img.shields.io/badge/node-14-green) ![DB2](https://img.shields.io/badge/_-ibm_db2-blue) ![Docker](https://img.shields.io/badge/_-docker-cyan) ![Openshift](https://img.shields.io/badge/Red_Hat-OpenShift-red)
# db2-samplejs
Demo application used to connect to IBM DB2 database

## Build the webapp on your local dev environment

Ensure that the correct version of nodejs is used (see `package.json`)
```
npm install 
npm run build  (or npm run build:dev to avoid js/css minification)
```
The build creates web front end files. Note: `npm run dev` can be used to build start the webpack-dev-server for debugging 


You can test locally your changes by launching the web server: 

You need to set the following ENV variable

`export db2_connection='{"database":"SAMPLE","hostname":"xx.xx.xx.xx","uid":"db2inst1","pwd":"xxxx","port":"50000","protocol":"TCPIP"}'`

or 

Create and update the file `./server/config/dev-config.json` (see `./server/config/dev-config_example.json`)

start the application: `npm start`

To view the db2-samplejs home page, open your browser: `https://localhost:3000`

## Build the webapp on a docker container on your local environment
See: [Docker instructions](docker_instructions.md)

## Build on Red Hat OpenShift Container Platform
See: TODO