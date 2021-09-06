'use_strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const sftp = require('gulp-sftp');
const del = require('del');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const getWebpackConfig = require('./webpack.config');

const { webApps } = require('./gulp.config');

gulp.task('clean', () => {
    return del('./build');
});

gulp.task('build', gulp.series('clean', cb => {
    const config = getWebpackConfig({ production: true });

    webpack(config, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString());
        cb();
    });
}));

gulp.task('deploy-frontend', gulp.series('build', () => {
    const opts = {
        ...webApps.frontend,
        log: gutil.log
    };

    return gulp
        .src('./build/**', { base: './build', buffer: false })
        .pipe(sftp(opts));
}));


gulp.task('deploy-dataset', () => {
    const opts = {
        ...webApps.dataset,
        log: gutil.log
    };

    return gulp
        .src('./public/**', { base: './public', buffer: false })
        .pipe(sftp(opts));
});

gulp.task('deploy', gulp.parallel('deploy-dataset', 'deploy-frontend'));

gulp.task('webpack-dev-server', () => {
    const config = getWebpackConfig({ production: false });
    const compiler = webpack(config);

    new webpackDevServer(compiler, config.devServer).listen(8080, 'localhost', function (err) {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080');
    });
});