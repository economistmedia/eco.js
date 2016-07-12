"use strict";

module.exports = function(grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        // Define Directory
        dirs: {
            js:     "src",
            build:  "dist"
        },

        // Metadata
        pkg: grunt.file.readJSON("package.json"),
		
	    // Make sure there are no obvious mistakes
	    jshint: {
	      options: {
	        // jshintrc: '.jshintrc',
	        reporter: require('jshint-stylish')
	      },
	      all: {
	        src: [
	          '<%= dirs.js %>/eco.js'
	        ]
	      },
	      test: {
	        options: {
	          // jshintrc: 'test/.jshintrc'
	        },
	        src: ['test/spec/{,*/}*.js']
	      }
	    },

        // Minify and Concat archives
        uglify: {
            options: {
                mangle: false,
            },
            dist: {
              files: {
                  "<%= dirs.build %>/eco.min.js": "<%= dirs.js %>/eco.js"
              }
            }
        },

        // Notifications
        notify: {
          js: {
            options: {
              title: "Javascript - <%= pkg.title %>",
              message: "Minified and validated with success!"
            }
          }
        }
});


    // Register Taks
    // --------------------------

    // Observe changes, concatenate, minify and validate files
    grunt.registerTask( "default", ["uglify", "notify:js" ]);

};