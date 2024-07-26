<?php
namespace Pseudocode\VariousScripts\Lib;

class Controller
{
  protected $view;
  protected $routes;
  
  public function __construct()
  {
    $this->routes = Instance::instance()->getRoutes();
  }
}
