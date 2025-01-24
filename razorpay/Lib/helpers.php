<?php

  function _e($txt) {
    echo $txt;
  }

  function env($string) {
    $variable = strtoupper($string);
    return $_ENV[$variable];
  }

  function b64($str, $t = 'encode') {
    if($t == 'decode') {
      return base64_decode($str);
    }
    
    return base64_encode($str);
  }

  /**
   * function _locate
   * This function is used for reducing the retyping of header location
   * $path path to redirect
  */
  function redirect($path) {
    header("Location: ".$path);
    exit;
  }

  /*  function unsetSession
  // This function is used for unsetting the specified session variables
  // $str    variable name of the session you want to unset
  */
  function unsetSession($str) {
    if (isset($_SESSION[$str])) {
      unset($_SESSION[$str]);
    }
  }

  function flashMessage($var, $class = 'success') {
    if (isset($_SESSION[$var]) && !empty($_SESSION[$var])) {
      echo '<div class="notify"><div class="'.$class.'">'.$_SESSION[$var].'</div></div>';
      unsetSession($var);
    }
  }

  function pr($ar='', $exit = true) {
      
    if(isset($ar) || !empty($ar)) {
      if(is_array($ar) || is_object($ar)) {
        echo "<pre>";
        print_r($ar);
        echo "</pre>";
        if ($exit) {
          exit;
        }
      } else  {
        echo $ar." is not Array";
      }
      
    } else {
      echo "Array is Blank";
      if ($exit) {
        exit;
      }
    }
    
  }
