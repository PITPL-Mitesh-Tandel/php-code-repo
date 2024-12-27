<?

  ob_start();
    $curl = curl_init( );

    //echo $url;

    $accessToken = "d6jgLlMb1kbHa9ZkVrEDgkPAW1w=x-jEMBsjd6b0b3091da77aa4aa0601307a0097dd730b68646bcb514c4b330dd67f945ee4eac12754ec08e8c95a39df4f0e46313f3b71ed76e110b8369aa2f9551ee18e268483efb06779873b7e3d89a7449cbf4a3c8a79daa093981339dd37a2dc8be8d55f4a9f6362ec8d14329ae19cb56a1a17";

    $url= "https://api.humanapi.co/v1/human/activities/summaries/5ccd38bb933e790100c2c9a1";
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt( $curl, CURLOPT_HTTPHEADER, array( 'Authorization: Bearer ' . $accessToken ) );
    curl_setopt($curl,CURLOPT_USERAGENT,CURLOPT_USERAGENT);

  
    $op = curl_exec($curl);
    $op = ob_get_contents();

    ob_end_clean();
    $record = json_decode($op,1);


    print_r($record);

?>