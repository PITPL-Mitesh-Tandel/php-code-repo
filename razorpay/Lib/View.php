<?php

namespace Pseudocode\VariousScripts\Lib;

class View
{
  private $theme = 'default';
  private $layout = 'default';
  private $templateDir;
  private $data = [];
  public $publicUrl;
  private $publicPath;

  public function __construct()
  {
    $this->templateDir = env('SITE_PATH') . '/templates/' . $this->theme;
    $this->publicUrl = env('SITE_URL') . '/public/' . $this->theme;
    $this->publicPath = env('SITE_PATH') . '/public/' . $this->theme;
  }

  public function getTemplateDir()
  {
    return $this->templateDir;
  }

  public function setTemplateDir($templateDir)
  {
    $this->templateDir = $templateDir;
  }

  public function setLayout($layout)
  {
    $this->layout = $layout;
  }

  public function setData($data)
  {
    $this->data = $data;
  }

  public function display(string $template, array $data = [])
  {
    foreach ($data as $key => $value) {
      $$key = $value;
    }

    $templatePath = $this->templateDir . '/' . $template . '.php';
    if (!file_exists($templatePath)) {
      die('ERROR! Template file is missing. [' . $template . ']');
    }

    $layoutPath = $this->templateDir . '/' . $this->layout . '.php';
    if (!file_exists($layoutPath)) {
      die('ERROR! Layout file is missing. [' . $this->layout . ']');
    }

    $publicUrl = $this->publicUrl;
    $publicPath = $this->publicPath;
    $siteUrl = env('SITE_URL');
    $theme = $this->theme;

    include_once $layoutPath;
  }

  public function displayTemplate(string $template, array $data = [])
  {
    foreach ($data as $key => $value) {
      $$key = $value;
    }

    $templatePath = $this->templateDir . '/' . $template . '.php';
    if (!file_exists($templatePath)) {
      die('ERROR! Template file is missing. [' . $template . ']');
    }

    $publicUrl = $this->publicUrl;
    $publicPath = $this->publicPath;
    $siteUrl = env('SITE_URL');
    $theme = $this->theme;

    include $templatePath;
  }
}
