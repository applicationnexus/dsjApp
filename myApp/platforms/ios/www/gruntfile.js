module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
   // Tasks
   watch: {
	compass: {
		files: ['scss/app.scss'],
		tasks: ['compass:prod']
	},
  	js: {
		files: ['lib/js/**/*.js'],
		tasks: ['uglify']
	}
  },

  compass: {
	dev: {
		options: {              
           sassDir: ['scss'],
           cssDir: ['css'],
           environment: 'development'
		}
	},
	prod: {
		options: {              
			sassDir: ['scss'],
			cssDir: ['css'],
			environment: 'production'
		}
	},
  },
  uglify: {
	all: {
		files: {
			'lib/js/plugins/loaded.plugins.min.js': [
			'lib/js/plugins/modernizr.svg.min.js',
			'lib/js/plugins/lodash.js', 
			'lib/js/plugins/angular-cache-2.3.3.min.js',
			'lib/js/plugins/ui-bootstrap-custom-tpls-0.10.0.js', 
			'lib/js/plugins/moment.min.js', 
			'lib/js/plugins/localization.js', 
			'lib/js/angular/angular-sanitize.min.js',
			'lib/js/angular/angular-cookies.min.js',
			'lib/js/plugins/loading-bar.min.js'
			]
		}
	},
  },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['compass:prod', 'uglify', 'watch']);

};
