# STORE MAN,
*[][][][][][][][][][][]*

## Table of content :
  - [Prerequisites](#prerequisites)
  - [Available Scripts](#available-scripts)
    - [npm run mongodb](#npm-run-mongodb)
    - [npm run server:dev](#npm-run-serverdev)
    - [npm run server:prod](#npm-run-serverprod)
    - [npm run client:dev](#npm-run-clientdev)
    - [npm run client:build](#npm-run-clientbuild)
    - [npm run static](#npm-run-static)
  - [Configs indications](#configs-indications)
  - [Metrics / Monitoring](#metrics-and-monitoring)


## Prerequisites

Make sure you have :
  * NodeJS(>=8.9.4)
  * MongoDB(>=3.0)
  * `/bin/bash` environment available for current unix user.
  * Install project dependencies `npm install`.
  * (optional) Install PM2 globally `npm install -g pm2`.<br>
  * (recommended) Use Yarn over NPM.


## Available Scripts

In the project directory, you can run:

### `npm run mongodb`

Runs MongoDB daemon.

### `npm run server:dev`

Runs the API in **development** mode.

### `npm run server:prod`

Runs the API in **production** mode.

### `npm run client:dev`

It runs the React app with `webpack-dev-server`.<br>
Open up [http://localhost:8080](http://localhost:8080) on the Browser.

### `npm run client:build`

Bundles the React app for production in `/client/build` folder.

### `npm run static`

Runs a static server located in ./static/"html"


## Configs indications

* **MongoDB**
  * By default now, `/server/mongodb/` is the database location, you can specify your own in `/server/services/mongodb.sh`.
  * A straightforward command : `mongod -dbpath '~/MongoDB' --port 10007 --bind_ip 127.0.0.1,192.167.0.1`

* **Used Ports**
  * **Server**, development and production ports setup in [ecosystem](./server/ecosystem.config.js).
  * **React/Redux development mode**, get a look into [webpack](/client/webpack.config.js) `PORT` variable.
  * **MongoDB**, we use default configuration. Feel free to setup new values in `mongodb.sh`

* **Redux Store**
  * After a successful authentication, we use [Saga middleware](./client/redux/middleware/Saga.js) to fire up data on the browser with multiple async calls to API and finally mount Redux store at once (escape side effect multiple React app updates).


## Metrics and Monitoring

* PM2 an advanced process manager and straightforward to use (start/stop/restart/delete/show/monit).<br>
* Use `pm2 list` to list available apps and get some information about the process. The setup is here [ecosystem](./server/ecosystem.config.js).<br>
* Start server and mongodb with pm2 : `pm2 start [app-name]|[pid]`, example : `pm2 start api-store-man`.
* Stoping a process : `pm2 stop api-store-man`.
* Clear config and reload ecosystem : `pm2 delete id|name|all`, `pm2 reload ecosystem.config.js --only api-store-man`, omit `--only` to reload all apps.
* To monitor the resource usage use `pm2 imonit` and `pm2 monit`, [further command cheatsheet ..](https://github.com/Unitech/pm2).
