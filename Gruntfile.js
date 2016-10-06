//
// MySite
// V1
// -------------------------------------------------


/*
 * INSTRUCTIONS TO GET RUNNING
 * (sudo) npm install -g grunt-cli
 * npm install
 * (sudo) npm install -g bower
 * gem install bundler
 * bundle install
 *
 * "$ grunt build" to build all files one
 * "$ grunt watch" to automatically build files upon file changes
 */

module.exports = function (grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Include variables for file paths from appconfig
    var appConfig = {}; // <%= app.src %>/css/
    var localConfig = {};

    //Include local appconfig if available
    if(grunt.file.isFile('appconfig.local.json')){
      localConfig = grunt.file.readJSON('appconfig.local.json');
    }

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-required-engine');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-pixrem');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-notify');
    grunt.task.run('notify_hooks');

    // Begin base grunt config
    grunt.initConfig({

        app: appConfig,
        pkg: grunt.file.readJSON('package.json'),

        // -------------------------------------------------
        //WATCH FILES AND TASKS
        watch: {
            sass: {
                files: ['sass/{,*/}{,*/}{,*/}*.{scss,sass}'],
                tasks: ['sass:build', 'notify:css']
            },
            scripts: {
              files: ['js/*.js'],
              tasks: ['uglify', 'string-replace', 'notify:js']
            }
        },


        //BUILD
        sass: {
          build: {
            options: {
              style: 'expanded',
              lineNumbers: true
            },
            files:  {
              'build/css/mestyle.css': 'sass/mestyle.scss'
            }
          },
        },

        uglify: {
          options: {
            /*compress: {
              drop_console: true
            },*/
            beautify: true,
            sourceMap: true,

            mangle: false
          },
          my_target: {
            files: [{
                expand: true,
                cwd: 'js',
                src: [
                  '**/*.js'
                ],
                dest: 'build/js'
            }]
          }
        },
        notify_hooks: {
          options: {
            enabled: true,
            max_jshint_notifications: 5, // maximum number of notifications from jshint output
            title: "MySite", // defaults to the name in package.json, or will use project directory's name
            success: true, // whether successful grunt executions should be notified automatically
            duration: 3 // the duration of notification in seconds, for `notify-send only
          }
        },
        notify: {
          css: {
            options: {
              title: 'MySite',  // optional
              message: 'CSS rebuilt', //required
            }
          },
          js: {
            options: {
              title: 'MySite',  // optional
              message: 'JS rebuilt', //required
            }
          },
          build: {
            options: {
              title: 'MySite',  // optional
              message: 'Grunt build complete', //required
            }
          }
        }

    });

    // -------------------------------------------------
    //Register Build
    grunt.registerTask('build', function(target) {
        grunt.task.run([
            'sass:build',
            'uglify',
            'notify:build'
        ]);
    });

    // -------------------------------------------------
    //Default task
    grunt.registerTask('default', [
        'watch',
    ]);
};
