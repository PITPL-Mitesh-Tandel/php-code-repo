<?php
namespace Pseudocode\VariousScripts\Lib\Controllers;

use Pseudocode\VariousScripts\Lib\Classes\Emailer;

class MailController
{
  public function testMail()
  {
    header("Content-type: application/json");

    $emailObj = new Emailer();

    $edata = array(
        'email' => env('ADMIN_EMAIL'),
        'fullname' => 'Admin',
        'subject' => 'Testing Email for Email Configuration',
        'template' => 'test-mail',
    );
    
    $status = $emailObj->sendMail($edata);

    if ($status === false) {
        $response = array(
            'status' => 'failed',
            'message' => 'ERROR! Something is wrong.'
        );
    } else {
        $response = array(
            'status' => 'success',
            'message' => 'Contact email has been successfully sent.',
        );
    }

    return json_encode($response);
  }
}
