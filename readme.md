# Enpress

[![buddy pipeline](https://app.buddy.works/flip/enpress/pipelines/pipeline/180329/badge.svg?token=4e448897946ead9e39e8c61c2994b2ada30968ed9d14ac21ebaba710d823db64 "buddy pipeline")](https://app.buddy.works/flip/enpress/pipelines/pipeline/180329)

To set up a new Enpress project, run the follow commands:

```
git clone --depth=1 https://github.com/weareflip/enpress.git <project_name>
cd <project_name>
composer install
mv .env.example .env
php artisan key:generate
php artisan salts:generate
npm install
```

Finally open the website to complete the Wordpress setup.
