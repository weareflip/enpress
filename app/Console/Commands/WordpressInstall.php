<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class WordpressInstall extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'wp:install {title?} {username?} {password?} {--email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initiates the Wordpress database';

    public $siteDetails = [
        'title' => 'Enpress',
        'email' => 'admin@example.com',
        'username' => '',
        'password' => ''
    ];

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
     * Create a new command instance.
     *
     * @return void
     */
    private function getInput() : void
    {
        $input = collect($this->input->getArguments())
            ->only([
                'title',
                'username',
                'password',
                'email'
            ]);

        if (!isset($input['title']) || empty($input['title'])) {
            $input['title'] = $this->ask('Website title:', 'Enpress');
        }

        if (!isset($input['username']) || empty($input['username'])) {
            $input['username'] = $this->ask('Admin username:');
        }

        if (!isset($input['password']) || empty($input['password'])) {
            $input['password'] = $this->secret('Admin password:');
        }

        // Any answers to missing data will override existing defaults
        $this->siteDetails = $input->union($this->siteDetails);
    }

    private function validate() : void
    {
        $requiredDetails = collect($this->siteDetails)->keys();

        foreach ($requiredDetails as $detail) {
            if (empty($this->siteDetails[$detail])) {
                $this->error(Str::title(str_replace('_', ' ', $detail)). ' must not be blank');
                exit(1);
            }
        }
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->getInput();
        $this->validate();

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        $response = wp_install(
            $this->siteDetails['title'],
            $this->siteDetails['username'],
            $this->siteDetails['email'],
            true,
            '',
            wp_slash( $this->siteDetails['password'] ),
            'en_US'
        );

        return $response;
    }
}
