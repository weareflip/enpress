<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class WordpressInstall extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'wp:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initiates the Wordpress database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $site_name = $this->ask('Website name (Default: Enpress):', 'Enpress');
        $admin_username = $this->ask('Admin username:');
        $admin_password = $this->secret('Admin password:');

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        $response = wp_install(
            $site_name,
            $admin_username,
            'dev@weareflip.none',
            true,
            '',
            wp_slash( $admin_password ),
            'en_US'
        );

        return $response;
    }
}
