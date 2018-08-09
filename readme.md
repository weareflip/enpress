# Enpress

To set up a new Enpress project, run the follow commands:

```
git clone --depth=1 https://github.com/enpress/enpress.git <project_name>
cd <project_name>
composer install
mv .env.example .env
php artisan key:generate
php artisan salts:generate
npm install
```

Finally open the website to complete the Wordpress setup.
