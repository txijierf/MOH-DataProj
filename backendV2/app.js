// Express tools
import express, { Router } from "express";
import cors from "cors";
import passport from "passport";
import { json, urlencoded } from "body-parser";

import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

import { secretKey as secret } from "./config/constants";

import { setupRoutes, setupDatabases } from "./utils";

const logger = require("morgan");

const _init = async () => {
  const mode = process.env.NODE_ENV;

  console.log(`Starting app in ${mode} mode`);

  try {
    const app = express();

    app.set("port", process.env.PORT || 3000);

    app.use(cors({ credentials: true, origin: (_origin, callback) => callback(null, true) }));

    app.use(logger("dev")); 
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: false, limit: "50mb" }));
    
    // Cookies and sessions
    app.use(cookieParser());
    app.use(cookieSession({ name: "session", secret, cookie: { maxAge: 8640000 } }));
    

    app.use(passport.initialize());
    app.use(passport.session());
    
    await setupDatabases({ createDatabase: false });
    
    setupRoutes(router, passport);

    app.use("/", router);

    // catch 404 and forward to error handler
    app.use((_req, _res, next) => {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    });
    
    // error handler (four parameters)
    app.use((err, req, res) => {
      if (err === error.api.NO_PERMISSION) {
        res.status(403).json({success: false, message: error.api.NO_PERMISSION});
      } else {
        console.error(err);
        res.status(err.status || 500).json({
          success: false,
          message: err.message,
          stack: req.app.get("env") === "development" ? err.stack : {},
        })
      }
    });

    // Setup and start of server
    const server = http.createServer(app)
      .on("error", (error) => {
        console.error(`Failed to start app in ${mode} mode`);
        throw error;
      });
    
    if (mode !== "test") {
      server.listen(app.get("port"), () => console.log(`Successfully started app in ${mode} mode\nExpress server listening on port ${app.get("port")}`));
    }
  } catch(error) {
    console.error(`Failed to start app in ${mode} mode`, error);
  }
};

_init();