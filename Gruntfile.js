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
    expand: true,
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
    compress: {
      main: {
        options: {
          archive: 'release-beta.zip'
        },
        expand: true,
        cwd: 'dist/zip',
        src: ['**/*', '.*/*'],
        dest: './',
      }
    },
    clean: ["dist", "release-beta.zip"],
    run: {
      report: {
        exec: "mocha ./test/main.js ./test/ --recursive --exit --check-leaks -R mochawesome"
      },
      buildFrontend: {
        exec: "yarn run frontend:build"
      },
      pivotal: {
        exec: `cd ./dist/zip && cf push ${pivotal.appName} -c "yarn --cwd backend start"`
      }
    },
    env: { aws, pivotal }
  });

  // mkdir for zip archive
  grunt.registerTask("mkdir", function () {
    grunt.file.mkdir('dist/zip/temp');
    grunt.file.mkdir('dist/zip/uploads');
    grunt.file.mkdir('dist/zip/public/react');
  });

  // registerTask(taskName, taskList)
  grunt.registerTask("build:aws", ["clean", "run:report", "env:aws", "run:buildFrontend", "mkdir", "copy:main", "compress"]);

  grunt.registerTask("pivotal:build", ["clean", "env:pivotal", "run:buildFrontend", "mkdir", "copy:main"]);
  grunt.registerTask("pivotal:publish", ["run:pivotal"]);
  grunt.registerTask("build:pivotal", ["pivotal:build", "pivotal:publish"]);
};
