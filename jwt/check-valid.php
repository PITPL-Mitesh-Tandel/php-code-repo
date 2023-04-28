<?php
    require_once 'functions.php';

    $isJWTValid = isJWTValid('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImV4cCI6MTY4MjQwMDA0OH0.RnPXlRNF0THmvfIqgBK_uT6-yBOXiP74sOrk1uoE8Ek');

    echo "\n";

    if ($isJWTValid === true) {
        echo "JWT is valid\n";
    } else {
        echo "JWT is invalid\n";
    }
