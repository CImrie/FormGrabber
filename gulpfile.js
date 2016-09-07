var elixir = require('laravel-elixir');
require('laravel-elixir-vueify');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('main.scss');
    mix.sass('page.scss');

    mix.copy('resources/assets/fonts', 'public/fonts');

    mix.browserify('popup.js');
    mix.browserify('page.js');
    mix.browserify('background.js');

    mix.copy(
       'resources/assets/js/lib'
    , 'public/js/lib');

    mix.copy(
        'resources/assets/js/models'
        , 'public/js/models');

    mix.scripts([
        'models/User.js',
        'background.js'
    ], 'public/js/background-compiled.js', 'public/js');

    mix.scripts([
        'lib/jquery-2.1.4.js',
        'lib/page-crawler.js',
        'page.js'
    ], 'public/js/page-compiled.js', 'public/js');

    mix.scripts([
        'lib/gAnalytics.js',
        'popup.js'
    ], 'public/js/popup-compiled.js', 'public/js');
});