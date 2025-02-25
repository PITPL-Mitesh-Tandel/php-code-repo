<?php

  function e($txt) {
    echo $txt;
  }

  function env($str) {
    $str = strtoupper($str);
    return $_SERVER[$str];
  }

  function b64($str, $t = 'encode') {
    if($t == 'decode') {
      return base64_decode($str);
    }
    
    return base64_encode($str);
  }

  /**
   * Strip punctuation from text.
   */
  function stripPunctuation( $text )
  {
    $urlbrackets    = '\[\]\(\)';
    $urlspacebefore = ':;\'_\*%@&?!' . $urlbrackets;
    $urlspaceafter  = '\.,:;\'\-_\*@&\/\\\\\?!#' . $urlbrackets;
    $urlall         = '\.,:;\'\-_\*%@&\/\\\\\?!#' . $urlbrackets;
    
    $specialquotes  = '\'"\*<>';
    
    $fullstop       = '\x{002E}\x{FE52}\x{FF0E}';
    $comma          = '\x{002C}\x{FE50}\x{FF0C}';
    $arabsep        = '\x{066B}\x{066C}';
    $numseparators  = $fullstop . $comma . $arabsep;
    
    $numbersign     = '\x{0023}\x{FE5F}\x{FF03}';
    $percent        = '\x{066A}\x{0025}\x{066A}\x{FE6A}\x{FF05}\x{2030}\x{2031}';
    $prime          = '\x{2032}\x{2033}\x{2034}\x{2057}';
    $nummodifiers   = $numbersign . $percent . $prime;
    
    return preg_replace(
      array(
      // Remove separator, control, formatting, surrogate,
      // open/close quotes.
        '/[\p{Z}\p{Cc}\p{Cf}\p{Cs}\p{Pi}\p{Pf}]/u',
      // Remove other punctuation except special cases
        '/\p{Po}(?<![' . $specialquotes .
          $numseparators . $urlall . $nummodifiers . '])/u',
      // Remove non-URL open/close brackets, except URL brackets.
        '/[\p{Ps}\p{Pe}](?<![' . $urlbrackets . '])/u',
      // Remove special quotes, dashes, connectors, number
      // separators, and URL characters followed by a space
        '/[' . $specialquotes . $numseparators . $urlspaceafter .
          '\p{Pd}\p{Pc}]+((?= )|$)/u',
      // Remove special quotes, connectors, and URL characters
      // preceded by a space
        '/((?<= )|^)[' . $specialquotes . $urlspacebefore . '\p{Pc}]+/u',
      // Remove dashes preceded by a space, but not followed by a number
        '/((?<= )|^)\p{Pd}+(?![\p{N}\p{Sc}])/u',
      // Remove consecutive spaces
        '/ +/',
      ),
      ' ',
      $text );
  }

  $words_array = array('a','and','the','an','it','is','with','can','of','why','not','.','s');
  $symbol_array = array("'",":",'"','&','/','(',')','{','}','[',']',',','...');
  /* takes the input, scrubs bad characters */
  function generateSEOLink($input, $replace = '-', $remove_words = true)
  {
    $input = html_entity_decode( strtolower($input), ENT_NOQUOTES, "UTF-8" );
    
    //make it lowercase, remove punctuation, remove multiple/leading/ending spaces
    $return = trim(preg_replace('[^\pL\pN\pP]','',stripPunctuation($input)));
    
    //remove words, if not helpful to seo
    //i like my defaults list in removeWords(), so I wont pass that array
    if($remove_words) { $return = removeWords($return,$replace); }
    
    //convert the spaces to whatever the user wants
    //usually a dash or underscore..
    //...then return the value.
    return str_replace(' ',$replace, $return);
  }

  /* takes an input, scrubs unnecessary words */
  function removeWords($input, $replace, $unique_words = true)
  {
    global $words_array, $symbol_array;
    
    //separate all words based on spaces
    $input_array = explode(' ',$input); //print_r($input_array);
    $input_array = array_splice($input_array, 0, 15);

    //create the return array
    $return = array();

    //loops through words, remove bad words, keep good ones
    foreach($input_array as $word)
    {
      //if it's a word we should add...
      if(!in_array($word,$words_array) && ($unique_words ? !in_array($word,$return) : true)) {
        $return[] = str_replace($symbol_array, "", $word);
      }
    }
    
    //return good words separated by dashes
    return implode($replace,$return);
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

  /**
	 * Update template by replacing template parameters to related values from provided data and constant variables
	 * @param String $html: Email template HTML body with paramters
	 * @param Array $data: Array of data with parameter values
	 * @return String: Returns final HTML email template with replaced paramters
	 */
	function updateTemplate($html, $data = []) {
		preg_match_all("/{[^}]*}/", $html, $matches);
		if (sizeof($matches) > 0) {
			foreach ($matches[0] as $match) {
				$match = preg_replace('/[^a-zA-Z0-9_ %\[\]\.\(\)%&-]/s', '', $match);
				
				// Replace the paramters from respective data array values if available
				if (isset($data[$match])) {
					$html = str_replace("{".$match."}", nl2br($data[$match]), $html); //pr($data[$match], false);
				}
				
				// Replace the parameters from respective constants if defined
				if(isset($_ENV[$match])) {
					$html = str_replace("{".$match."}", $_ENV[$match], $html);
				}
			}
		}
		return $html;
	}
