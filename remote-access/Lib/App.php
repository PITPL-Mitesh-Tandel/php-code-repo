<?php
namespace Tapverse\MultiverseCMSSync\Lib;

use Tapverse\MultiverseCMSSync\Lib\Classes\DbPDO;
use Tapverse\MultiverseCMSSync\Lib\Classes\Route;

class App extends Instance
{
  private $template;
  private $action;
  private $title;
  private $controllerName;
  private $controller;
  private $routes;

  protected $controllerNS = "Tapverse\MultiverseCMSSync\Lib\Controllers\\";

  public function __construct(string $id = 'default')
  {
    parent::__construct($id);
    $this->checkDB();
    $this->errorReporting();
    $this->checkRoute();
  }

  private function errorReporting()
  {
    ini_set('error_reporting', E_ALL);
    error_reporting(E_ALL);
    ini_set('log_errors', true);
    ini_set('html_errors', false);
    ini_set('error_log', env('SITE_PATH').'/logs/error.log');
    ini_set('display_errors', env('DISPLAY_ERRORS'));
  }

  /**
   * Check the DB connection
   */
  public function checkDB() {
    static $db;

    if (isset($db)) {
      return $db;
    }

    $db = new DbPDO(env('DB_TYPE'));
    
    if ($db->connect() === false) {
      
      $body = array(
        'title' => 'DB ERROR!',
        'message' => 'Unable to connect database. Please check db configuration.'
      );
      $this->View->setData($body);
      $this->View->display('404');
    }

    return $db;
  }

  public function checkRoute()
  {
    $main_path = explode('?', $_SERVER['REQUEST_URI']); //pr($main_path); exit;
    $path = str_replace(env('HOME_DIR'), '', $main_path[0]); //echo $path; exit;
    $this->routes = $route = Route::match($path); //pr($route);

    $templateConfig = isset($route['config']) ? $route['config'] : '404.php|PageController|notFound|';

    list($this->template, $this->controllerName, $this->action, $this->title) = explode("|", $templateConfig);

    $this->controlledAction();
  }

  public function controlledAction()
  {
    $controller = $this->controllerNS . $this->controllerName ?? 'PageController';

    if (!class_exists($controller)) {
      die('ERROR! Controller class is missing. ['.$this->controllerName.']');
    }

    $this->controller = new $controller();
    if (!method_exists($this->controller, $this->action)) {
      die('ERROR! Controller method is missing. ['.$this->action.']');
    }

    if (!empty($this->template)) {
      $this->controller->template = $this->template;
    }
    
    $this->controller->{$this->action}();
  }

  public function getRoutes()
  {
    return $this->routes;
  }
}
