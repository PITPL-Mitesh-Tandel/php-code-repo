<?php
namespace Tapverse\MultiverseCMSSync\Lib;

class View
{
  private $theme = 'default';
  private $layout = 'default';
  private $templateDir;
  private $data = [];
  private $publicUrl;
  private $publicPath;

  public function __construct()
  {
    $this->templateDir = env('SITE_PATH').'/templates/'.$this->theme;
    $this->publicUrl = env('SITE_URL').'/public/'.$this->theme;
    $this->publicPath = env('SITE_PATH').'/public/'.$this->theme;
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

  public function webpConvert($filePath, $newWidth = 1920, $compressionQuality = 80)
  {
    $file = $this->publicPath.$filePath;
    if (!file_exists($file)) {
        return false;
    }

    list($width, $height) = getimagesize($file);
    $r = $width / $height;

    $newHeight = $height;
    if ($width > $newWidth) {
      $newHeight = $newWidth / $r;
    } else {
      $newWidth = $width;
    }

    $file_type = exif_imagetype($file);

    $fileName = md5(pathinfo($file, PATHINFO_FILENAME)) . '.webp';

    $outputFile =  $this->publicPath.'/webp/'.$fileName;
    if (file_exists($outputFile)) {
        return $this->publicUrl.'/webp/'.$fileName;
    }
    if (function_exists('imagewebp')) {
        switch ($file_type) {
            case '1': //IMAGETYPE_GIF
                $image = imagecreatefromgif($file);
                break;
            case '2': //IMAGETYPE_JPEG
                $image = imagecreatefromjpeg($file);
                break;
            case '3': //IMAGETYPE_PNG
                    $image = imagecreatefrompng($file);
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                    break;
            case '6': // IMAGETYPE_BMP
                $image = imagecreatefrombmp($file);
                break;
            case '15': //IMAGETYPE_Webp
              return false;
                break;
            case '16': //IMAGETYPE_XBM
                $image = imagecreatefromxbm($file);
                break;
            default:
                return false;
        }
        // Resize the image
        $dst = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($dst, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        // Save the image
        $result = imagewebp($dst, $outputFile, $compressionQuality);
        if (false === $result) {
            return false;
        }
        // Free up memory
        imagedestroy($image);
        imagedestroy($dst);
        return $this->publicUrl.'/webp/'.$fileName;
      } elseif (class_exists('Imagick')) {
        $image = new Imagick();
        $image->readImage($file);
        if ($file_type === "3") {
            $image->setImageFormat('webp');
            $image->setImageCompressionQuality($compressionQuality);
            $image->setOption('webp:lossless', 'true');
        }
        $image->writeImage($outputFile);
        return $this->publicUrl.'/webp/'.$fileName;
      }
      return false;
  }

  public function display(string $template, array $data = [])
  {
    foreach ($data as $key => $value) {
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
    $publicPath = $this->publicPath;
    $siteUrl = env('SITE_URL');
    $theme = $this->theme;

    include_once $layoutPath;
  }
}
