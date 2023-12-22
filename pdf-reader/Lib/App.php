<?php
  namespace Pseudocode\PDFReader\Lib;

use Pseudocode\PDFReader\Lib\Classes\DbPDO;
use Pseudocode\PDFReader\Lib\Classes\Route;

  class App extends Instance
  {
    private $template;
    private $action;
    private $title;
    private $controllerName;
    private $controller;

    protected $controllerNS = "Pseudocode\PDFReader\Lib\Controllers\\";

    public function __construct(string $id = 'default')
    {
      parent::__construct($id);

      $this->initLogs();

      $this->checkDB();
      $this->checkRoute();
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
      
      if($db->connect() === false) {
        
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
      $route = Route::match($path); //pr($route);

      $templateConfig = isset($route['config']) ? $route['config'] : '404.php||404 - Page not found|';

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

    private function initLogs()
    {
      ini_set('error_reporting', E_ALL);
      error_reporting(E_ALL);
      ini_set('log_errors', true);
      ini_set('html_errors', false);
      ini_set('error_log', env('LOG_PATH'));
      ini_set('display_errors', env('ENV') === 'dev');
    }
  }
