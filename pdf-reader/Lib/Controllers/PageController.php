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
    $textContent = nl2br($pdf->getText());

    die($textContent);
  }
}
