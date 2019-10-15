/**
 * Alfred: This file contains strategies/designs from my project which I found to be useful for testing and structuring
 * Ref: https://github.com/greylemon/Calendar-Web-App/blob/master/back-end/utils.js
 */

import mongoose from "mongoose";

import { testDatabase as DATABASE_NAME_TEST, database as DATABASE_NAME } from "./config/config";

import userModel from "./models/user";

import groupModel from "./models/group";
import organizationModel from "./models/organization/organization";

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
  options = { createDatabase: true, wipeDatabase: false, createDummyData: false, ...options };

  //  TODO
  // Creates the collections of the database
  const _createDatabase = async () => {
    try {
      await userModel.createCollection();
    } catch(error) {
      console.log(error);
    }
  };
  const _createDummyData = async () => {
    console.log("MongoDB: Creating dummy data");
    try {
      // Create user
      const adminPermissions = [ "CRUD-workbook-template", "create-delete-attribute-category", "user-management", "system-management", "workbook-query", "package-management" ];
  
      const Linda = { username: "linda", email: "linda@ontario.ca", organization: "sampleOrg", validated: true, active: true, groupNumber: 1, permissions: adminPermissions };
  
      let user = await userModel.findOne({ username: "linda" });
  
      if(!user) {
        user = await userModel.register(Linda, "password123");
      }
  
      // Create group and organization
      const orgDup = await organizationModel.findOne({ groupNumber: 1, name: "sampleOrg" });
      const groupDup = await groupModel.findOne({ groupNumber: 1, name: "First group" });
      
      if(!orgDup) {
        await organizationModel.create({ users: [ user._id ], managers: [ user._id ], name: "sampleOrg", groupNumber: 1 });
      }
      
      if(!groupDup) {
        await groupModel.create({ groupNumber: 1, name: "First group" });
      }
      
      console.log("MongoDB: Successfully created dummy data");
    } catch(error) {
      console.log("ERROR", error);
    }
  };
  

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

      const databaseEnv = process.env.NODE_ENV === "test" ? DATABASE_NAME_TEST : DATABASE_NAME;
      await mongoose.connect(databaseEnv, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true, });

      // Options
      // if(wipeDatabase) await _wipeDatabase();
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
// "CRUD-workbook-template",
// "create-delete-attribute-category",
// "user-management",
// "system-management",
// "workbook-query",
// "package-management"

export const setupDatabases = async (options) => {
  try {
    console.log("Databases: Setting up databases");

    await _setupMongoose(options);

    console.log("Databases: Successfully set up databases");
  } catch (error) {
    console.error("Databases: Failed to set up databases", error);
  }
};