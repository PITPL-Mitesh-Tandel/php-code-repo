<?php



if(!empty($_POST))
{


$postdata = file_get_contents("php://input");
 $request = json_decode($postdata,1);


//$s_email = 

$sanitized_email =  filter_var($request['email'], FILTER_SANITIZE_EMAIL);
$sanitized_name =  filter_var($request['firstname'], FILTER_SANITIZE_STRING);
$sanitized_phone =  filter_var($request['phone'], FILTER_SANITIZE_NUMBER_INT);
$sanitized_message =  filter_var($request['firstname'], FILTER_SANITIZE_STRING);
//phone
//message
//FILTER_SANITIZE_STRING
$to  = "lumiere@atelierdada.com";

if($request['lang']=='fr')
{
  $to = "lumiere@atelierdada.com";
}

//$to="lumiere@atelierdada.com,  lumiere@atelierdada.com";

//$to = "hiral1982@gmail.com";
$message = "<h3>You have new contact request from website:</h3>
  <table width='50%' style='background-color: #ccc' > 
    <tr><td>
  <table style='background-color: #fff' width='100%'  cellpadding='5' cellspacing='5' >
    <tr>
      <td><strong>Name</strong></td> <td>".$sanitized_name."</td></tr>
      <tr>
       <td>Email</td>
       <td>".$sanitized_email."</td></tr>
          <tr>
          <td>Phone</td> <td>".$sanitized_phone."</td></tr>
           <tr> <td>Message</td><td>".$sanitized_message."</td>  </tr>
  </table>
  </td>
  </tr></table>";

$subject = "Contact Request - Atelier dada Website";

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";


mail($to,$subject,$message,$headers) or die('Something went wrong');

}



?>