import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import connectMongo from 'connect-mongo'
import passport from 'passport'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import expressValidator from 'express-validator'

import projectConfig from 'Config/project.config'
import serverConfig from './config/server'
import './middleware/passport'
import routes from './routes'

// Connect to database.
// Connection should be established outside createServer()
// to be shared across server instances.
// Multiple server instances are created only when unit-testing.

// Plugging in native ES6 promises library.
mongoose.Promise = global.Promise
mongoose.connect(serverConfig.DB_URI)
mongoose.connection.once('open', () => {
  console.log('Connected to database.')
})
mongoose.connection.on('error', () => {
  console.log('DB connection error.')
  process.exit()
})

const createServer = () => {
  // Create a server.
  const app = express()

  // Configure the server.
  app.set('port', projectConfig.port)

  app.use(bodyParser.json())

  app.use(methodOverride())
  app.use(expressValidator())

  // Configure the session
  const MongoStore = connectMongo(session)

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: serverConfig.SESSION_SECRET,
    store: new MongoStore({
      url: serverConfig.DB_URI,
      autoReconnect: true,
    }),
  }))

  // Configure the passport middleware.
  app.use(passport.initialize())
  app.use(passport.session())

  // For backend API.
  app.use('/api', routes)

  // Webpack hot loader.
  if (projectConfig.globals.__DEV__) { // eslint-disable-line no-underscore-dangle
    app.use(require('./middleware/hot-reload').default) // eslint-disable-line global-require
  }

  app.use(express.static(projectConfig.dir_dist))
  app.use(require('./middleware/render').default) // eslint-disable-line global-require

  return app
}

export default createServer
