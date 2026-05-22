FROM php:8.2-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev \
        unzip \
        libonig-dev \
        git \
    && docker-php-ext-install pdo pdo_mysql mbstring zip \
    && a2enmod rewrite \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer --version \
    && rm -rf /var/lib/apt/lists/*

RUN echo 'DocumentRoot /var/www/html/public' > /etc/apache2/sites-available/000-default.conf
RUN echo '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>' >> /etc/apache2/apache2.conf

WORKDIR /var/www/html

EXPOSE 80

