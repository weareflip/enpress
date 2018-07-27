# Build app image
FROM php:7.1-apache as app
LABEL maintainer="We Are Flip <https://github.com/weareflip>"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
         libfreetype6-dev \
         libjpeg62-turbo-dev \
         libpng-dev \
         libxml2-dev \
    && rm -r /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
RUN docker-php-ext-install \
        mbstring \
        gd \
        mysqli \
        pdo_mysql

RUN a2enmod \
        rewrite \
        proxy \
        proxy_http \
        ssl

ADD .docker/build/apache.conf /etc/apache2/sites-available/000-default.conf
ADD .docker/build/php.ini ${PHP_INI_DIR}/conf.d/99-overrides.ini

WORKDIR /app