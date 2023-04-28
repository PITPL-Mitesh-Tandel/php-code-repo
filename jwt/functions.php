<?php
    function generateJWT($headers, $payload, $secret = 'secret')
    {
        $headersEncoded = base64UrlEncode(json_encode($headers));
        
        $payloadEncoded = base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('SHA256', "$headersEncoded.$payloadEncoded", $secret, true);
        $signatureEncoded = base64UrlEncode($signature);
        
        return "$headersEncoded.$payloadEncoded.$signatureEncoded";
    }

    function isJWTValid($jwt, $secret = 'secret')
    {
        // split the jwt
        $tokenParts = explode('.', $jwt);
        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $signatureProvided = $tokenParts[2];
    
        // check the expiration time - note this will cause an error if there is no 'exp' claim in the jwt
        $expiration = json_decode($payload)->exp;
        if (($expiration - time()) < 0) {
            echo 'ERROR! Token expired';
            return false;
        }
    
        // build a signature based on the header and payload using the secret
        $base64UrlHeader = base64UrlEncode($header);
        $base64UrlPayload = base64UrlEncode($payload);
        $signature = hash_hmac('SHA256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = base64UrlEncode($signature);
        
        return ($base64UrlSignature === $signatureProvided);
    }
    
    function base64UrlEncode($str)
    {
        return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
    }

    function generateAPIKey($companyId, $salt, $secret = 'secret')
    {
        $signature = hash_hmac('SHA256', "$salt.$companyId", $secret, true);
        return base64UrlEncode($signature);
    }
