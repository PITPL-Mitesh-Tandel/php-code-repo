<?php 

/**
 * Helper class to configure PHPMailer as per our requirements 
 * and send emails as per email template provided
 * 
 * Dependencies:
 * ----------------------------------------------------------------------------------------
 * Email sending functionality is dependent on external library
 * called PHPMailer. Include PHPMailer library using composer as follows
 * 
 * "require": {
 * 		"phpmailer/phpmailer": "~6.0"
 * }
 * 
 * @version 1.1.0 (Comments Added)
 */

namespace Pseudocode\VariousScripts\Lib\Classes;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Emailer extends PHPMailer
{
	protected $templatePath;

	public function __construct() {
		$this->templatePath = env('SITE_PATH').'/Lib/templates/';
	}
	
	/**
	 * Send email as per data provided to email list provided in data.
	 * Email body will be generated from provided template
	 *
	 * Data array contains following information:
	 * - Any parameters which are defined in template, will be assigned in data
	 * - Receiver email address and name
	 * - Subject of the email
	 *
	 * @param String $template: Template of the email body
	 * @param Array $data: Data to generate email body and
	 * 					   other details required for sending emails
	 * @return Boolean: Returns true on success otherwise returns false
	 */
	public function sendMail($data) { //pr($data, false);

		if (isset($data['template']) && !empty($data['template'])) {

			// Raise an exception that provided template file is not available at template path
			if (!file_exists($this->templatePath.$data['template'])) {
				throw new Exception("ERROR! Email template not available");
			}

			if (isset($data['message']) && !empty($data['message'])) {
				$data['message'] = $this->updateTemplate($data['message'], $data);
			}

			$html = file_get_contents($this->templatePath.$data['template']);
		}

		if (isset($data['body']) && !empty($data['body'])) {
			$html = $data['body'];
		}

		if (!isset($html) || empty($html)) {
			return false;
		}

		if (sizeof($data) > 0) {
			$html = $this->updateTemplate($html, $data);
		}
		
		// Set basic parameters to send email
		$this->IsSMTP();
		$this->Host = env('MAIL_HOST');
		$this->SMTPDebug = env('MAIL_DEBUG');
		$this->SMTPAuth = true;
		$this->Port = env('MAIL_PORT');
		$this->Username = env('MAIL_FROM');
		$this->Password = env('MAIL_PASSWORD');
		$this->SMTPSecure = env('MAIL_SECURE');
		$this->Debugoutput = 'html';
		
		// Update email specific parameters
		$this->SetFrom(env('MAIL_FROM'), env('MAIL_NAME'));

		if (isset($data['email']) && is_array($data['email'])) {
			foreach ($data['email'] as $email) {
				$this->AddAddress($email);
			}
		} else {
			$this->AddAddress($data['email']);
		}
		
		$this->Subject = $data['subject'];
		$this->MsgHTML($html);
		
		return $this->Send();
	}
	
	/**
	 * Update template by replacing template parameters to related values from provided data and constant variables
	 * @param String $html: Email template HTML body with paramters
	 * @param Array $data: Array of data with parameter values
	 * @return String: Returns final HTML email template with replaced paramters
	 */
	protected function updateTemplate($html, $data) {
		preg_match_all("/{[^}]*}/", $html, $matches);
		if (sizeof($matches) > 0) {
			foreach ($matches[0] as $match) {
				$match = preg_replace('/[^a-zA-Z0-9_ %\[\]\.\(\)%&-]/s', '', $match);
				
				// Replace the paramters from respective data array values if available
				if (isset($data[$match])) {
					$html = str_replace("{".$match."}", nl2br($data[$match]), $html); //pr($data[$match], false);
				}
				
				// Replace the parameters from respective constants if defined
				if(isset($_ENV[strtoupper($match)])) {
					$html = str_replace("{".$match."}", $_ENV[strtoupper($match)], $html);
				}
			}
		}
		return $html;
	}
}
