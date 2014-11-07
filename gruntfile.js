module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner: '// Backbone.StateRouter v<%= meta.version %>\n'
    },

    preprocess: {
      router: {
        src: 'src/wrapper.js',
        dest: 'build/backbone.state-router.js'
      }
    },

    template: {
      options: {
        data: {
          version: '<%= meta.version %>'
        }
      },
      router: {
        src: '<%= preprocess.router.dest %>',
        dest: '<%= preprocess.router.dest %>'
      }
    },

    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      router: {
        src: '<%= preprocess.router.dest %>',
        dest: '<%= preprocess.router.dest %>'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      router: {
        src: '<%= preprocess.router.dest %>',
        dest: 'build/backbone.state-router.min.js',
        options: {
          sourceMap: true
        }
      }
    },

    jshint: {
      router: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/*.js', '!src/wrapper.js']
      },
      tests: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/*.js']
      }
    },

    mochaTest: {
      unit: {
        options: {
          require: 'test/setup/node.js',
          reporter: 'dot',
          clearRequireCache: true,
          mocha: require('mocha')
        },
        src: [
          'test/setup/helpers.js',
          'test/unit/*.js'
        ]
      }
    },

    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../../coverage/src/'
      }
    },

    instrument: {
      files: 'src/*.js',
      options: {
        lazy: true,
        basePath: 'coverage'
      }
    },

    storeCoverage: {
      options: {
        dir: 'coverage'
      }
    },

    makeReport: {
      src: 'coverage/**/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    coveralls: {
      options: {
        src: 'coverage/lcov.info',
        force: false
      },
      default: {
        src: 'coverage/lcov.info'
      }
    },

    watch: {
      tests: {
        options: {
          spawn: false
        },
        files: ['src/**/*.js', 'test/unit/**/*.js'],
        tasks: ['test']
      }
    }
  });

  grunt.registerTask('test', 'Test the library', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('coverage', 'Generate coverage report for the library', [
    'env:coverage',
    'instrument',
    'mochaTest',
    'storeCoverage',
    'makeReport',
    'coveralls'
  ]);

  grunt.registerTask('build', 'Build the library', [
    'test',
    'preprocess:router',
    'template',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', 'An alias of test', [
    'test'
  ]);
};
