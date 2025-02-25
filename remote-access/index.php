<?php
    namespace Tapverse\MultiverseCMSSync;

    use Tapverse\MultiverseCMSSync\Lib\App;
    use Dotenv\Dotenv;

    require_once "vendor/autoload.php";

    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    try {
        $appObj = new App;
    } catch (\Exception $e) {
        $error = $e->getMessage();
        die('AppLoad: '.$error);
    }
