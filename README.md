# Ferme Ayla

```
         . . .
       .        .  .     ..    .
    .                 .         .  .
                    .
                   .                ..
   .          .            .              .
   .            '.,        .               .
   .              'b      *
    .              '$    #.                ..
   .    .           $:   #:               .
 ..      .  ..      *#  @):        .   . .
              .     :@,@):   ,.**:'   .
  .      .,         :@@*: ..**'      .   .
           '#o.    .:(@'.@*"'  .
   .  .       'bq,..:,@@*'   ,*      .  .
              ,p$q8,:@)'  .p*'      .
       .     '  . '@@Pp@@*'    .  .
        .  . ..    Y7'.'     .  .
                  :@):.
                 .:@:'.
               .::(@:.'.**  # Ferme d'Ayla
```


## Table of content :
  - [Prerequisites](#prerequisites)
  - [Available Scripts](#available-scripts)
    - [npm start:2](#npm-start2)
    - [npm run mongodb](#npm-run-mongodb)
    - [npm run server](#npm-run-server)
    - [npm run server:prod](#npm-run-serverprod)
    - [npm run client](#npm-run-client)
    - [npm run client:build](#npm-run-buildclient)
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

### `npm start:2`

Runs MongoDB daemon, then Server api and try to connect to the database when `mongod` is ready.

### `npm run mongodb`

Runs MongoDB daemon.

### `npm run server`

Runs the API in **development** mode.

### `npm run server:prod`

Runs the API in **production** mode.

### `npm run client`

It runs the React app with `webpack-dev-server`.<br>
Open up [http://localhost:8080](http://localhost:8080) on the Browser.

### `npm run client:build`

Bundles the React app for production in `/client/build` folder.


## Configs indications

* **MongoDB**
  * By default `/server/mongodb/` is the database location, you can specify your own in `/server/services/mongodb.sh`.
  * It use default configuration. Feel free to setup new values in `mongodb.sh`
  * A straightforward command : `mongod -dbpath '~/MongoDB' --port 10007 --bind_ip 127.0.0.1,192.167.0.1`

* **Used Ports**
  * **Server**, development and production ports setup in [ecosystem](./server/ecosystem.config.js).
  * **React/Redux development mode**, get a look into [webpack](/client/webpack.config.js) `PORT` variable.

* **Redux Store**
  * After a true authentication, we used Saga middleware to fire up data on the browser.
  * [File configuration](./client/redux/middlewares/Saga.js)


## Metrics and Monitoring

* Watch mode is installed and preconfigured for server api and for mongo db models, each change on files will reload the app process as the following structure:
  * `/server/api/*` server reload
  * `/server/api/models` mongodb reload
If you changed those two paths, watch mode [setup](./server/ecosystem.config.js) have to be updated too, to Watch over.
* In all modes development and production for both server api and mongo database we use `pm2` package, an advanced process manager and straightforward to use (start/stop/restart/delete/show/monit).<br>
* Use `pm2 list` to list available apps and get some information about the process. The setup is here [ecosystem](./server/ecosystem.config.js).<br>
* Start server and mongodb with pm2 : `pm2 start [app-name]|[pid]`, example : `pm2 start api-ferme-ayla`.
* Stoping a process : `pm2 stop api-ferme-ayla`.
* Clear config and reload ecosystem : `pm2 delete id|name|all`, `pm2 reload ecosystem.config.js --only api-ferme-ayla`, omit `--only` to reload all apps.
* To monitor the resource usage use `pm2 imonit` and `pm2 monit`, [further command cheatsheet ..](https://github.com/Unitech/pm2).
