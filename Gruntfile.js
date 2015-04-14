module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		src: [
			"src/polyfill.js",
			"src/effect.js",
			"src/utils.js",
			"src/parser.js",
			"src/easing.js"
		],
		meta: {
			banner: "/*!\n * <%= pkg.title %> v<%= pkg.version %> - " +
			"<%= grunt.template.today('yyyy-mm-dd') %> - <%= pkg.description %>\n" +
			" *\n" +
			" * <%= pkg.repository.url %>\n" +
			" *\n" +
			" * Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author %>\n" +
			" * Released under <%= pkg.license %> license.\n */\n\n"
		},
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: "<%= src %>",
				dest: 'dist/effect.js'
			}
		},
		uglify: {
			options: {
				banner: "<%= meta.banner %>"
			},
			min: {
				files: {
					"dist/effect.min.js": ["dist/effect.js"]
				}
			}
		}
	});

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	
	// Short list as a high frequency watch task
	grunt.registerTask("dist", ["concat:dist", "uglify:min"]);
  
	// Default grunt
	grunt.registerTask("default", ["dist"]);

};