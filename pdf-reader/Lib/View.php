<?php
namespace Pseudocode\PDFReader\Lib;

class View
{
  private $theme = 'default';
  private $layout = 'default';
  private $templateDir;
  private $data = [];
  private $publicUrl;

  public function __construct()
  {
    $this->templateDir = env('SITE_PATH').'/templates/'.$this->theme;
    $this->publicUrl = env('SITE_URL').'/public/'.$this->theme;
  }

  public function getTemplateDir() {
    return $this->templateDir;
  }

  public function setTemplateDir($templateDir) {
    $this->templateDir = $templateDir;
  }

  public function setData($data) {
    $this->data = $data;
  }

  public function display($template)
  {
    foreach ($this->data as $key => $value) {
      $$key = $value;
    }

    $templatePath = $this->templateDir.'/'.$template.'.php';
    if (!file_exists($templatePath)) {
      die('ERROR! Template file is missing. ['.$template.']');
    }

    $layoutPath = $this->templateDir.'/'.$this->layout.'.php';
    if (!file_exists($layoutPath)) {
      die('ERROR! Layout file is missing. ['.$this->layout.']');
    }

    $publicUrl = $this->publicUrl;
    $siteUrl = env('SITE_URL');

    include_once $layoutPath;
  }
}
