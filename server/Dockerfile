FROM php:8.2-apache

# Enable mod_rewrite and headers
RUN a2enmod rewrite headers

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev unzip \
    && docker-php-ext-install zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY . .

# Install PHP dependencies (PhpSpreadsheet for Excel parsing)
RUN composer require phpoffice/phpspreadsheet --no-interaction --no-dev

# Create data directories
RUN mkdir -p data/queue data/processed data/rejected \
    && chmod -R 755 data \
    && chown -R www-data:www-data data

# Apache config for Cloud Run (port 8080)
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

EXPOSE 8080

CMD ["apache2-foreground"]
