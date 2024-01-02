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

    // $textArray = explode("\n", $text); pr($textArray, false);

    // foreach($textArray as $text) {
    //   if ($this->stringDateToday($text)) {
    //     echo 'Date Found';
    //   }
    // }

    var_dump($this->stringDateToday("Times of India	, 09/08/13"));
  }

  private function stringDateToday($string) {
    $reg = "/([0-9]?[0-9])[\.\-\/ ]+([0-1]?[0-9])[\.\-\/ ]+([0-9]{2,4})/";

    $date = new \DateTime();

    preg_match($reg, $string, $matches); pr($matches, false);

    if (isset($matches[0])) {
        return $matches[0] == $date->format("d/m/y");
    }

    return false;
  }
}
