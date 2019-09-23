/**
 * Alfred: This file contains strategies/designs from my project which I found to be useful for testing and structuring
 * Ref: https://github.com/greylemon/Calendar-Web-App/blob/master/back-end/utils.js
 */

import mongoose from "mongoose";

import { testDatabase as DATABASE_NAME_TEST, database as DATABASE_NAME } from "./config/config";

/**
 * Mongoose and MongoDB set up.
 * 
 * By default, the database collections is created.
 * 
 * Options can be specified for specified for the following:
 *   _createDatabase: default true
 *   _wipeDatabase: default false
 *   _createDummyData: default false
 */
const _setupMongoose = async (options) => {
  // default options - overwrite defaults when specified.
  options = { createDatabase: true, wipeDatabase: false, createDummyUser: false, ...options };

  //  TODO
  // Creates the collections of the database
  const _createDatabase = () => {};
  const _createDummyData = () => {};
  

  // Drops the collection of a database
  const _wipeDatabase = async () => {
    console.warn(`MongoDB: Dropping all collections`);
    try{
      await mongoose.connection.dropDatabase();
      
      console.warn(`MongoDB: Successfully dropped all collections`);
    } catch(error){
      console.error(`MongoDB: Failed to drop all collections`, error);
    }
  };


  const _init = async ({ createDatabase, wipeDatabase, createDummyData }) => {
    try {
      console.log("MongoDB: Setting up database");

      const databaseEnv = process.env.NODE_ENV === 'test' ? DATABASE_NAME_TEST : DATABASE_NAME;
      await mongoose.connect(databaseEnv, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true, });

      // Options
      if(wipeDatabase) await _wipeDatabase();
      if(createDatabase) await _createDatabase();
      if(createDummyData) await _createDummyData();

      console.log("MongoDB: Successfully set up database");
    } catch (error) {
      console.error("MongoDB: Failed to set up database", error);
    }
  };

  await _init(options);
};

// PERMISSIONS
// 'CRUD-workbook-template',
// 'create-delete-attribute-category',
// 'user-management',
// 'system-management',
// 'workbook-query',
// 'package-management'

export const setupDatabases = async (options) => {
  try {
    console.log("Databases: Setting up databases");

    await _setupMongoose(options);

    console.log("Databases: Successfully set up databases");
  } catch (error) {
    console.error("Databases: Failed to set up databases", error);
  }
};