# Structure of Project
  - config: include all configurations for mailServer, LdapServer, permissions and error.
  - controller: include all back end API for excel, registration process and basic pages.
  - documents: include all document work 
  - models: include all objects used in projects such as User, Organization, and RegisterRequest.
  - node_modules: include all library roots
  - pictures: include all pictures used in project
  - public: include all front end CSS and JavaScript code
  - routes: include all routers connecting front end command and back end functions
  - test
  - views: include all front end HTML code. The folder "Common" includes footer bar and header bar for each page. "excel-web" includes front end code of excel part. "sidebar" include all front end code for left sidebar. Other ejs files contain codes for other common pages.
  - app.js: the beginning of the total project, which includes all middleware, error hanlder and connections.
  - package.json: include all dependences.
  
# About LDAP
  - We use Apache Directory Studio as the compass of LDAP database. You can ask Henry for the setup of Apache Directory Studio.
  - The configuration of LDAP is in config/config.js
  - The connection code of LDAP is in controller/registration/ldap.js
  - This project includes two libraries for LDAP: "ldapjs" and "passport-ldapauth", you can install them as below:
  ```
  npm install ldapjs
  npm install passport-ldapauth
  ```
  - Back end codes for LDAP signup and LDAP login are in controller/registration/ldap.js and controller/user.js
  - Front end codes for LDAP signup and LDAP login are in views/signup.ejs, views/login.ejs, public/moh.js/login.js and public/moh.js/signup.js
  
# About User/Registration Request Management
  - User Management page can manage all users and manage their permissions and active. Back end code for user management is in controller/userManagement.js. Front end code for user management is in views/sidebar/userManagement.ejs and public/moh.js/userManagement.js
  - Registration Request Management page approves or disapproves register requests. This page can only be accessed by manager account. If approved, one new user will be created in LDAP and local server.
  - Back end code for Registration Request Management page is in controller/userManagement.js. Front end code for user management is in views/sidebar/registerManagement.ejs and public/moh.js/registerManagement.js
# Something unfinished
  - In Sign Up page, add the label "Choose Organization" and "Choose role" to local server.
  - In Sign Up page, decline the label "Organization Number" for local server and ldap server. User only need to Choose Organization Name. We have a mapping function in the back end to map each organization name with a organization number. About Sign Up page, you can talk with Lester for details.
  - In Register Request Management page, Group Number should be shown up.
  - In create organization page, add "delete" and "motify" organization options.
