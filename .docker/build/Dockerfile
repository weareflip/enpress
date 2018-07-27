# Build backend source
FROM composer as backend
WORKDIR /app

COPY composer.json composer.lock /app/
RUN composer install  \
    --ignore-platform-reqs \
    --no-ansi \
    --no-autoloader \
    --no-dev \
    --no-interaction \
    --no-scripts

COPY . /app/
RUN composer dump-autoload --optimize --classmap-authoritative

# Build frontend assets
FROM node as frontend
WORKDIR /app
COPY package.json package-lock.json webpack.common.js webpack.prod.js postcss.config.js /app/

RUN npm install

COPY resources/assets /app/resources/assets
RUN npm run build:dist

# Build app image
FROM php:7.1-apache as app
LABEL maintainer="We Are Flip <https://github.com/weareflip>"

RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libmagickwand-dev \
    imagemagick \
  && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
  && docker-php-ext-install \
    gd \
    mbstring \
    opcache \
    mysqli \
    pdo_mysql \
  && pecl install imagick \
  && docker-php-ext-enable imagick

RUN a2enmod rewrite

ADD .docker/build/apache.conf /etc/apache2/sites-available/000-default.conf
ADD .docker/build/php.ini ${PHP_INI_DIR}/conf.d/99-overrides.ini

WORKDIR /app
COPY --from=backend /app /app
COPY --from=frontend /app/public/dist /app/public/dist

RUN chgrp -R www-data /app/storage /app/bootstrap/cache && chmod -R ug+rwx /app/storage /app/bootstrap/cache