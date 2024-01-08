<?php
namespace Pseudocode\PDFReader\Lib\Controllers;

use Pseudocode\PDFReader\Lib\Controller;
use Bhaktaraz\PDFReader\Item;
use Bhaktaraz\PDFReader\Feed;
use Bhaktaraz\PDFReader\Channel;
use Pseudocode\PDFReader\Lib\Models\Content;

class PageController extends Controller
{
  public $template;

  public function home()
  {
    $this->view->display('pages/'.$this->template ?? 'home');
  }

  public function readPdf()
  {
    $states = [
      'ANDAMAN & NICOBAR ISLANDS',
      'ANDHRA PRADESH',
      'ARUNACHAL PRADESH',
      'ASSAM',
      'BIHAR',
      'CHANDIGARH',
      'CHHATTISGARH',
      'DADAR & NAGAR HAVELI',
      'DAMAN & DIU',
      'GOA',
      'GUJARAT',
      'HARYANA',
      'HIMACHAL PRADESH',
      'JAMMU & KASHMIR',
      'JHARKHAND',
      'KARNATAKA',
      'KERALA',
      'LADAKH',
      'LAKSHADWEEP',
      'MADHYA PRADESH',
      'MAHARASHTRA',
      'MANIPUR',
      'MEGHALAYA',
      'MIZORAM',
      'NAGALAND',
      'NCT OF DELHI',
      'ODISHA',
      'PUDUCHERRY',
      'PUNJAB',
      'RAJASTHAN',
      'SIKKIM',
      'TAMIL NADU',
      'TELANGANA',
      'TRIPURA',
      'UTTARAKHAND',
      'UTTAR PRADESH',
      'WEST BENGAL',
      'NATIONAL NEWS FROM INDIA',
      'UTTARAKHAND & HIMACHAL PRADESH',
      'SOUTH ASIA',
      'BANGLADESH',
      'INTERNATIONAL NEWS',
      'IN MEMORY',
    ];

    $config = new \Smalot\PdfParser\Config();
    // Whether to retain raw image data as content or discard it to save memory
    $config->setRetainImageContent(true);

    // Initialize and load PDF Parser library
    $parser = new \Smalot\PdfParser\Parser([], $config);
    
    // Source PDF file to extract text
    $file = env('SITE_PATH').'/files/PROTECTED-AREA-UPDATE-165.pdf';
    
    // Parse pdf file using Parser library
    $pdf = $parser->parseFile($file);
    
    // Extract text from PDF
    $text = $pdf->getText();

    $textArray = explode("\n", $text); pr($textArray, false);

    $startDoc = 0;
    foreach($textArray as $key => $text) {
      if (trim($text) == 'NEWS FROM INDIAN STATES') {
        $startDoc = $key;
      }
    }

    $contents = []; $urlFound = false; $j = 0; $startContent = 0;
    for($i=$startDoc; $i<=sizeof($textArray);$i++) {

      if (in_array(trim($textArray[$i]), $states) || in_array(trim($textArray[$i].$textArray[$i+1]), $states)) {
        $startContent = $i;
      }
      if ($this->checkIfUrlExists($textArray[$i])) {
        $urlFound = true;
        $contents[$j] = [
          'start' => $startContent,
          'end' => $i
        ];

        $j++;
        continue;
      }
      if ($this->checkIfDateExists($textArray[$i])) {
        if ($urlFound == true) $j--;
        $contents[$j] = [
          'start' => $startContent,
          'end' => $i
        ];
        $urlFound = false;
        $j++;
      }
    } pr($contents);
  }

  private function checkIfDateExists($string) {
    $regex = "/([0-9]?[0-9])[\.\-\/ ]+([0-1]?[0-9])[\.\-\/ ]+([0-9]{2,4})/";

    if (preg_match($regex, $string, $matches)) {
        return true;
    }

    return false;
  }

  private function checkIfEmailExists($string) {
    $regex = '/[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})/';

    if (preg_match($regex, $string, $matches)) {
        return true;
    }

    return false;
  }

  private function checkIfUrlExists($string) {
    $regex = '/[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)/';

    if (preg_match($regex, $string, $matches)) {
        return true;
    }

    return false;
  } 
}
