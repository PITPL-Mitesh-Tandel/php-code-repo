<?php
namespace Tapverse\MultiverseCMSSync\Lib\Controllers;

use Tapverse\MultiverseCMSSync\Lib\Controller;
use Tapverse\MultiverseCMSSync\Lib\Models\Article;

class PageController extends Controller
{
  public $template;

  public function home()
  {
    return e("Welcome to Useful Scripts.");
  }

  public function notFound()
  {
    return e("ERROR! Page not found.");
  }
}
