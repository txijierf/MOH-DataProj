const pivotal = require("./config/pivotal");
const aws = require("./config/aws");

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-env');
  
  const backendFilesConfig = {
    expand: true,
    cwd: "./backend",
    src: [ "public/**", "controller/**", "models/**", "routes/**", "app.js", "package.json", "yarn.lock" ],
    dest: "dist/zip"
  };

  const frontendFilesConfig = {
    cwd: "./frontend/dist",
    src: [ "**" ],
    dest: "dist/zip/public/react"
  };

  const awsFilesConfig = {
    expand: true,
    src: [ ".ebextensions/**", "config/aws" ],
    dest: "dist/zip"
  };

  grunt.initConfig({
    // Allows references to properties/scripts in package.json
    pkg: grunt.file.readJSON("package.json"),
    copy: {
      main: {
        files: [ backendFilesConfig, awsFilesConfig, frontendFilesConfig ]
      }
    },
    compress: {},
    clean: [],
    run: {
      report: {
        exec: "mocha ./test/main.js ./test/ --recursive --exit --check-leaks -R mochawesome"
      },
      buildFrontend: {
        exec: "yarn run frontend:build"
      },
      pivotal: {
        exec: `cd ./build/zip && cf push ${pivotal.appName} -c "node -r esm app.js"`
      }
    },
    env: { aws, pivotal }
  });
};