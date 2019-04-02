<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token">

    <title>{{ get_bloginfo('name') }}</title>

    <?php wp_head(); ?>

    <?php \App\Assets::style('app') ?>

    @includeWhen(env('APP_ENV') === 'development', 'utils.hmr')
</head>
<body class="webpack-loading">

<main>
    @yield('content')
</main>

<?php wp_footer() ?>

<?php \App\Assets::script('app') ?>
</body>
</html>
