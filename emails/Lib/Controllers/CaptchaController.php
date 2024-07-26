<?php
namespace Pseudocode\VariousScripts\Lib\Controllers;

use Pseudocode\VariousScripts\Lib\Classes\Emailer;

class MailController
{
  public function testMail()
  {
    header("Content-type: application/json");

    if (env('RECAPTCHA') == true) {
      if (!isset($_POST['g-recaptcha-response'])) {
          $response = array(
              'status' => 'failed',
              'message' => 'ERROR! Please check "I\'m not a robot"'
          );

          die($response['message']);
      }

      // Storing google recaptcha response in $recaptcha variable
      $recaptcha = $_POST['g-recaptcha-response'];
    
      // Hitting request to the URL, Google will respond with success or error scenario
      $url = 'https://www.google.com/recaptcha/api/siteverify?secret='.env('RECAPTCHA_SECRET')
            . '&response=' . $recaptcha;
    
      // Making request to verify captcha
      $response = file_get_contents($url);
    
      // Response return by google is in JSON format, so we have to parse that json
      $response = json_decode($response);

      if ($response->success !== true) {
          $response = array(
              'status' => 'failed',
              'message' => 'ERROR! Invalid entry: token failed'
          );

          die($response['message']);
      }
    }

    if (!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $response = array(
            'status' => 'failed',
            'message' => 'ERROR! Invalid entry'
        );

        die($response['message']);
    }

    $emailObj = new Emailer();

    $edata = array(
        'email' => env('ADMIN_EMAIL'),
        'fullname' => 'Admin',
        'contact_email' => $_POST['email'],
        'contact_name' => $_POST['name'],
        'contact_phone' => $_POST['phone'],
        'contact_service' => $_POST['service'],
        'contact_message' => $_POST['message'],
        'subject' => 'New Contact: '.$_POST['name'],
        'template' => 'new-contact',
    );
    
    $status = $emailObj->sendMail($edata);

    if ($status === false) {
        $response = array(
            'status' => 'failed',
            'message' => 'ERROR! Something is wrong.'
        );
    } else {
        $_SESSION['code'] = $code = md5(time());
        $response = array(
            'status' => 'success',
            'message' => 'Contact email has been successfully sent.',
            'code' => $code,
        );
    }

    e($response['message']);
  }

  public function sendEnquiryMail()
  {
    header("Content-type: application/json");

    if (env('RECAPTCHA') == true) {
      if (!isset($_POST['g-recaptcha-response'])) {
          $response = array(
              'status' => 'failed',
              'message' => 'ERROR! Please check "I\'m not a robot"'
          );

          die($response['message']);
      }

      // Storing google recaptcha response in $recaptcha variable
      $recaptcha = $_POST['g-recaptcha-response'];
    
      // Hitting request to the URL, Google will respond with success or error scenario
      $url = 'https://www.google.com/recaptcha/api/siteverify?secret='.env('RECAPTCHA_SECRET')
            . '&response=' . $recaptcha;
    
      // Making request to verify captcha
      $response = file_get_contents($url);
    
      // Response return by google is in JSON format, so we have to parse that json
      $response = json_decode($response);

      if ($response->success !== true) {
          $response = array(
              'status' => 'failed',
              'message' => 'ERROR! Invalid entry: token failed'
          );

          die($response['message']);
      }
    }

    if (!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
        $response = array(
            'status' => 'failed',
            'message' => 'ERROR! Invalid entry'
        );

        die($response['message']);
    }

    $emailObj = new Emailer();

    $edata = array(
        'email' => env('ADMIN_EMAIL'),
        'fullname' => 'Admin',
        'enquiry_email' => $_POST['email'],
        'enquiry_name' => $_POST['name'],
        'enquiry_phone' => $_POST['phone'],
        'enquiry_message' => $_POST['message'],
        'enquiry_service' => $_POST['service'],
        'enquiry_date' => $_POST['date'],
        'enquiry_time' => $_POST['time'],
        'subject' => 'New Service Enquiry: '.$_POST['name'],
        'template' => 'new-enquiry',
    );
    
    $status = $emailObj->sendMail($edata);

    if ($status === false) {
        $response = array(
            'status' => 'failed',
            'message' => 'ERROR! Something is wrong.'
        );
    } else {
        $_SESSION['code'] = $code = md5(time());
        $response = array(
            'status' => 'success',
            'message' => 'Contact email has been successfully sent.',
            'code' => $code,
        );
    }

    e($response['message']);
  }
}
