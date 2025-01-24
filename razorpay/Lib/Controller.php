<?php
namespace Pseudocode\VariousScripts\Lib;

class Controller
{
  protected $view;
  protected $routes;
  
  public function __construct()
  {
    $this->view = new View();
    $this->routes = Instance::instance()->getRoutes();
  }
}
