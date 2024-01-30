<?php
try {
  // $curl_handle = curl_init();
  // curl_setopt($curl_handle, CURLOPT_URL, urlencode('http://127.0.0.1:8001/images/Wheel Valve_1587410113.png'));
  // curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
  // curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
  // curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
  // $file = curl_exec($curl_handle);
  // curl_close($curl_handle);
  $file = file_get_contents("http://127.0.0.1:8001/images/".rawurlencode("Wheel Valve_1587410113.png"));
  echo $file;
} catch (\Throwable $th) {
  echo $th->getMessage();
}
