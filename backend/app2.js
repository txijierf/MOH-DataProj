// Server and Express
import express from "express";
import http from "http";

import path from "path";
import bodyParser from "body-parser";

import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

import cors from "cors";

// Authentication
import passport from "passport";
import LocalStrategy from "passport-local";

import config from "./config/config";
import error from "./config/error";

// Routes
import indexRouter from "./routes/index";
import usersRouter from "./routes/users"
import packageRouter from "./routes/v2/package02";

import userManagementRouter from "./routes/userManagement";

import RouterV2 from "./routes/v2";
import User from "./models/user";
import setup from "./controller/setup";

import { setupDatabases } from "./utils";

// Deprecated warning with es6 import for morgan
// import logger from "morgan";
const logger = require("morgan");

const _init = async () => {
  const mode = process.env.NODE_ENV;

  console.log(`Starting app in ${mode} mode`);

  try {
    const app = express();

    app.set('port', process.env.PORT || 3000);

    await setupDatabases({ wipeDatabase: true, createDummyData: true });
    
    app.use(cors({ credentials: true, origin: (_origin, callback) => callback(null, true) }));

    //log every request to the CONSOLE.
    app.use(logger("dev")); 
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
    
    // TODO: Find the purpose of these three
    app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
    app.use('/documents', express.static(path.join(__dirname, 'documents')));
    app.use('/test', express.static(path.join(__dirname, 'mochawesome-report')));
    
    // Cookies and sessions
    app.use(cookieParser());
    app.use(cookieSession({
      name: 'session',
      secret: config.superSecret,
      cookie: {maxAge: 24 * 3600 * 1000} // 24 hours
    }));
    
    // passport authentication setup
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(passport.initialize());
    app.use(passport.session());
    
    // setup.setup();
    
    //ROUTES
    // home page
    app.use('/', indexRouter);

    // user authentication related
    app.use('/', usersRouter);

    // api endpoints that need authentication
    app.use('/', packageRouter);
    app.use('/', userManagementRouter);
    app.use('/', ...RouterV2);
    
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    
    // error handler (four parameters)
    app.use(function (err, req, res) {
      if (err === error.api.NO_PERMISSION) {
        res.status(403).json({success: false, message: error.api.NO_PERMISSION});
      } else {
        console.error(err);
        res.status(err.status || 500).json({
          success: false,
          message: err.message,
          stack: req.app.get('env') === 'development' ? err.stack : {},
        })
      }
    });

    // Setup and start of server
    const server = http.createServer(app)
      .on('error', (error) => {
        console.error(`Failed to start app in ${mode} mode`);
        throw error;
      });
    
    if (mode !== 'test') {
      server.listen(app.get('port'), function () {
        console.log(`Successfully started app in ${mode} mode\nExpress server listening on port ${app.get('port')}`);
      });
    }
  } catch(error) {
    console.error(`Failed to start app in ${mode} mode`, error);
  }
};

_init();