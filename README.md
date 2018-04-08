This project is a combination between ReactJS, ExpressJS and MongoDB.

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

# Ferme Ayla


- [Prerequisites](#prerequisites)
- [Available Scripts](#available-scripts)
  - [npm run server](#npm-server)
  - [npm start](#npm-start)
  - [npm run build](#npm-run-build)
  - [mongod -dbpath ~/Mongodb/](#mongod--dbpath-~/Mongodb/)


## Prerequisites

Make sure you have NodeJS(>=8.9.4) and MongoDB(>=3.0) installed.

## Available Scripts

In the project directory, you can run:

### `npm run server`

Runs the API in development mode by default. This mode uses [nodemon](https://www.npmjs.com/package/nodemon).<br>
For production mode use `npm run server:prod`

### `npm start`

Development mode 2. It runs the React app with `webpack-dev-server`.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Bundles the React app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `mongod -dbpath ~/Mongodb/`

Starts the MongoDB daemon. `~/Mongodb/` is default database location, you can specify your own.<br>
