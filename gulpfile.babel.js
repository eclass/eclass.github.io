/**
 * Gulpfile Setup
 * @author Raúl Hernández <raulghm@gmail.com>
 * @since 2015-07-01
 */

/**
 * Import modules
 */
import gulp from 'gulp';
import del from 'del';
import path from 'path';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import merge from 'merge-stream';
import minimist from 'minimist';
import browserSync from 'browser-sync';
import postcssNested from 'postcss-nested';
import postcssImport from 'postcss-import';
import postcssReporter from 'postcss-reporter';
import postcssBem from 'postcss-bem';
import postcssClearfix from 'postcss-clearfix';
import postcssStyleGuide from 'postcss-style-guide';
import postcssHexrgba from 'postcss-hexrgba';
import postcssResponsiveType from 'postcss-responsive-type';
import postcssEasings from 'postcss-easings';
import stylelint from 'stylelint';
import configSuitcss from 'stylelint-config-suitcss';
import assign from 'lodash.assign';
import lost from 'lost';
import cssnext from 'cssnext';
import pngquant from 'imagemin-pngquant';

/**
 * Setting constants
 */
const $ = gulpLoadPlugins();
const argv = minimist(process.argv.slice(2));
const SRC = './src/'; // The source input folder
const DEST = './dist/'; // The build output folder
const BOWER = './bower_components/'; // The bower input folder
const RELEASE = !!argv.dist; // Minimize and optimize during the build?
const reload = browserSync.reload;

/**
 * jshint and jscs linter
 * See the .jscsrc and .eslintrc file for based rules
 */
gulp.task('eslint', () => {
	gulp.src(SRC + '/scripts/**/*.js')
		.pipe($.eslint('.eslintrc'))
		.pipe($.eslint.format());
});

gulp.task('jscs', () => {
	return gulp.src(SRC + '/scripts/**/*.js')
		.pipe($.jscs())
		.pipe($.jscsStylish());
});

gulp.task('lint', () => {
	runSequence(['eslint', 'jscs']);
});

/**
 * 3rd party libraries
 */
gulp.task('vendor', () => {
	return merge(
		// gulp.src(BOWER + '/respond/dest/respond.min.js')
		// 	.pipe(gulp.dest(DEST + '/scripts')),
		// gulp.src(BOWER + '/selectivizr/selectivizr.js')
		// 	.pipe(gulp.dest(DEST + '/scripts')),
		gulp.src(BOWER + '/jquery-legacy/dist/jquery.min.js')
			.pipe($.rename('jquery-legacy.min.js'))
			.pipe(gulp.dest(DEST + '/scripts')),
		gulp.src(BOWER + '/jquery-modern/dist/jquery.min.js')
			.pipe($.rename('jquery-modern.min.js'))
			.pipe(gulp.dest(DEST + '/scripts'))
	);
});

/**
 * Fonts
 */
gulp.task('fonts', () => {
	return gulp.src(['node_modules/font-awesome/fonts/*.*'])
		.pipe($.size({title: 'fonts'}))
		.pipe(gulp.dest(DEST + 'fonts/font-awesome'));
});

/**
 * Images
 */
gulp.task('images', () => {
	return gulp.src([SRC + 'images/**/**'])
		.pipe($.if(RELEASE, $.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
		})))
		.pipe(gulp.dest(DEST + 'images'));
});

/**
 * Bem linter
 * Bem lint using conventions from stylelint-config-suitcss
 */
gulp.task('bemlint', () => {
	/**
	 * Rules: https://github.com/stylelint/stylelint/blob/master/docs/rules.md
	 */
	const customConfig = {
		rules: {
			indentation: [2, 'tab'],
			'number-leading-zero': 0,
			'function-url-quotes': [2, 'single'],
			'string-quotes': [2, 'single'],
			'rule-properties-order': [0, 'alphabetical'],
		},
	};

	const config = {
		rules: assign(configSuitcss.rules, customConfig.rules),
	};

	return gulp.src(SRC + 'styles/**/components/**/*.css')
		.pipe($.postcss([
			stylelint(config),
			postcssReporter({
				clearMessages: true,
			}),
		]));
});

/**
 * Styles task
 */
gulp.task('styles', () => {
	const postcssPlugins = [
		cssnext({
			messages: {
				browser: false,
				console: false,
			},
		}),
		postcssImport(),
		// postcssBem,
		postcssClearfix,
		postcssNested,
		postcssHexrgba,
		postcssResponsiveType,
		postcssEasings,
		lost,
		postcssReporter({
			clearMessages: true,
		})
	];

	return gulp.src(SRC + 'styles/styles.css')
		/*.pipe($.changed(DEST + 'styles', {extension: '.css'}))*/
		/*.pipe($.sourcemaps.init())*/
		.pipe($.plumber())
		.pipe($.postcss(postcssPlugins))
		.pipe($.replace('../../node_modules/font-awesome/fonts/fontawesome-webfont', '../fonts/font-awesome/fontawesome-webfont'))
		.pipe($.if(RELEASE, $.uncss({
			html: [DEST + 'index.html'],
		})))
		.pipe($.if(RELEASE, $.replace('/*!', '/*'))) // remove special comments
		.pipe($.if(RELEASE, $.stripCssComments())) // remove comments
		.pipe($.if(RELEASE, $.cssnano())) // minify
		.pipe($.size({title: 'styles'}))
		/*.pipe($.sourcemaps.write('.'))*/
		.pipe($.if(RELEASE, $.rev()))
		.pipe(gulp.dest(DEST + '/styles'))
		.pipe($.if(RELEASE,
			$.rev.manifest(SRC + 'data/rev-manifest.json', {
				base: DEST,
				merge: true
			})
		))
		.pipe($.if(RELEASE, gulp.dest(DEST)))
		.pipe($.if(!RELEASE, reload({stream: true})));
});

/**
 * StyleGuide generator
 */
gulp.task('styleguide', () => {
	return gulp.src(DEST + 'styles/styles.css')
		.pipe($.postcss([
			postcssStyleGuide({
				name: 'eClass.io site',
			}),
		]))
		.pipe(gulp.dest(DEST + '/styles'));
});

/**
 * Scripts
 */
gulp.task('scripts', () => {
	const SCRIPTS = [
		BOWER + 'jQuery.dotdotdot/src/js/jquery.dotdotdot.js',
		SRC + 'scripts/**/*.js',
	];

	return gulp.src(SCRIPTS)
		/* .pipe($.changed(DEST + 'scripts', {extension: '.js'}))*/
		.pipe($.concat('scripts.js'))
		.pipe($.babel({
			comments: false,
		}))
		.pipe($.if(RELEASE, $.uglify({preserveComments: 'some'})))
		.pipe($.size({title: 'scripts'}))
		.pipe($.if(RELEASE, $.rev()))
		.pipe(gulp.dest(DEST + 'scripts'))
		.pipe($.if(RELEASE,
			$.rev.manifest(SRC + 'data/rev-manifest.json', {
				base: DEST,
				merge: true,
			})
		))
		.pipe($.if(RELEASE, gulp.dest(DEST)))
		.pipe($.if(!RELEASE, reload({stream: true})));
});

/**
 * Pages
 */
gulp.task('pages', () => {
	return gulp.src(SRC + '/templates/pages/*.hbs')
		.pipe($.plumber())
		// .pipe($.data(() => {
		// 	return require(SRC + 'data/data.json');
		// }))
		.pipe($.frontMatter({ property: 'data' }))
		.pipe($.hb({
			data: {
				rev: require(SRC + 'data/rev-manifest.json'),
				data: require(SRC + 'data/data.json'),
				dist: RELEASE,
			},
			helpers: SRC + 'helpers/*.js',
			partials: SRC + 'templates/partials/**/*.hbs',
		}))
		.pipe($.size({title: 'HTML'}))
		.pipe($.prettify({indent_size: 2}))
		.pipe($.rename({
			extname: '.html'
		}))
		.pipe(gulp.dest(DEST))
		.pipe($.if(!RELEASE, reload({stream: true})));
 });

/**
 * Clean task
 */
gulp.task('clean', () => {
	del([DEST]);
});

/**
 * Default task
 */
gulp.task('default', ['serve', 'watch']);

/**
 * Build task
 */
gulp.task('build', ['pages'], () => {
	runSequence([
		'fonts',
		'images',
		'styles',
		'vendor',
		'scripts',
		'pages',
	]);
});

/**
 * Watch task
 */
gulp.task('watch', () => {
	gulp.watch(SRC + 'images/**/**', ['images']);
	gulp.watch(SRC + 'styles/**/*.css', ['styles']);
	gulp.watch(SRC + 'scripts/**/*.js', ['scripts']);
	gulp.watch([SRC + 'data/**/*.*', SRC + '/templates/**/*.*'], ['pages']);
});

/**
 * Serve task
 */
gulp.task('serve', ['build'], () => {
	if (!RELEASE) {
		browserSync({
			notify: false,
			open: false,
			server: {
				baseDir: DEST,
			},
		});
	}
});
