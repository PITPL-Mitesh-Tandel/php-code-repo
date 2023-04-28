<?php
    require_once 'functions.php';

    // Generates a random string of ten digits
   $salt = mt_rand();

    $apiKey = generateAPIKey(100, $salt);

    echo $apiKey."\n";
