![Clockbeats](https://clockbeats.com/static/img/cb_logo.png)

[Clockbeats](https://clockbeats.com) is a portal of digital interaction, exchange and growth of ideas between
people who live, breath and create music.

### The home of artists.
Have you ever imagined a place where you can share your feelings, your talent, your ideas,
showing your competence and finding contacts for the finalization of your projects?
Clockbeats is the result of a wide dream: building a home with no walls, no barriers, no prejudices.

### Before you start
You should be sure you have already installed [PM2](http://pm2.keymetrics.io) and [MongoDB](https://www.mongodb.com) globally.

### Quick start
Runs [PM2](http://pm2.keymetrics.io) which runs [express-server](https://expressjs.com) on [http://127.0.0.1:8080](http://127.0.0.1:8080).
If you want to change the *port* or the *host* look into `common.config.js`. All variables comes from `.env` file.

On first time initialization application you should run fixtures `npm run fixtures` or `npx fixtures`. For more info look at the `./fixtures/index.js`.

All commands below works only for [PM2](http://pm2.keymetrics.io) in `development` mode with flag `--watch` to react on any file changes.
For more info look at the `package.json`.

Start application
```
npm start
```

Restart application
```
npm run restart || npx restart
```

Flush all logs
```
npm run flush || npx flush || pm2 flush
```

For more info and `npm` commands look at the `package.json` or print all commands with `npm run` command.

### Project structure
```
--config // Contains configuration for core modules on this project
  -database.js // Mongoose config
  -server.js // Express config
  -socket.js // Socket.io config
  
--core // Contains `heart` of this project
  -Controllers // Description of the behavior of a particular route
    -controller.js // Represents logical routing controller
    ...
    
  -Models // 
    -Model // Folder contain core information about model
      -index.js // Repository of this model
      -model.js // Model
      -selectors.js // Helps serialize data for specific needs
      ...
    -index.js // Exports all models.js files to the database
    -utils.js // Some repeated code.
    
  -Routing
    -private // Folder contains private rotes which needed for authenticated user.
    -index.js // Contains main info about routing.
    -some.js // Contains routes for specific route.
    ...
    
  -Services // Contains communication between Model`s repositories and other services
    -Service // Api for model behavior
    ...
```