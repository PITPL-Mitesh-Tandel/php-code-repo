<?php
    require_once 'functions.php';

    $headers = array(
        'alg' => 'HS256',
        'typ' => 'JWT'
    );
    $payload = array(
        'sub' => '1234567890',
        'name' => 'John Doe',
        'admin' => true,
        'exp' => (time() + 60)
    );

    $jwt = generateJWT($headers, $payload);

    echo $jwt;
