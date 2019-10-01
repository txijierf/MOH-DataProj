/**
 * Alfred: This file contains strategies/designs from my project which I found to be useful for testing and structuring
 * Ref: https://github.com/greylemon/Calendar-Web-App/blob/master/back-end/utils.js
 */

import mongoose from "mongoose";

import { DATABASE_TEST_KEY, DATABASE_KEY } from "./config/constants";

/**
 * Models are initialized here and only here to prevent duplicate creation which causes errors in mongoose.
 * 
 * Models are passed to controllers in the setupRoutes function.
 */

import OrganizationModel from "./model/organization/Organization";
import OrganizationTypeModel from "./model/organization/OrganizationType";
import GroupModel from "./model/organization/Group";

import PackageModel from "./model/package/Package";
import PackageValueModel from "./model/package/PackageValue";

import AttributeModel from "./model/workbook/Attribute";
import AttributeGroupModel from "./model/workbook/AttributeGroup";
import CategoryModel from "./model/workbook/Category";
import CategoryGroupModel from "./model/workbook/CategoryGroup";

import SheetModel from "./model/workbook/Sheet";
import ValueModel from "./model/workbook/Value";
import WorkbookModel from "./model/workbook/Workbook";

import UserModel from "./model/User";

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

      const databaseKey = process.env.NODE_ENV === 'test' ? DATABASE_TEST_KEY : DATABASE_KEY;
      await mongoose.connect(databaseKey, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true, });

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

export const setupRoutes = (router, passport) => {
  console.log("Routes: Creating routes and authenticators");

  const routeHelpers = { 
    router,
    passport,

    OrganizationModel, 
    OrganizationTypeModel, 

    GroupModel, 
    PackageModel, 
    PackageValueModel, 
    AttributeModel, 
    AttributeGroupModel, 
    CategoryModel, 
    CategoryGroupModel, 
    SheetModel, 
    ValueModel, 
    WorkbookModel 
  }; 

  // Passport authentication setup
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  // Controllers...

  console.log("Routes: Successfully set up routes and authenticators");
};

export const setupDatabases = async (options) => {
  try {
    console.log("Databases: Setting up databases");

    await _setupMongoose(options);

    console.log("Databases: Successfully set up databases");
  } catch (error) {
    console.error("Databases: Failed to set up databases", error);
  }
};