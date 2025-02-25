<?php
  /**
   * String class for all string operations
   *
   * @version 1.1.0 (Comments Added)
   */

  namespace Tapverse\MultiverseCMSSync\Lib\Classes;

  class StringFunction
  {

    /** Unwanted words to be removed from the string to generate SEO friendly string */
    protected $removeWords = array('a', 'and', 'the', 'an', 'it', 'is', 'with', 'can', 'of', 'why', 'not', '.', 's');

    /** Unwanted symbols to be removed from the string to generate SEO friendly string */
    protected $removeSymbols = array("'", ":", '"', '&', '/', '(', ')', '{', '}', '[', ']', ',', '...');

    /**
     * Find replace parameters from the provided string as per data provided.
     * This function match the parameters with defined constants and replace them with constant values.
     * @param String $url: String to be replaced
     * @param Array $data: Array of data to replace string parameters
     * @return String: Returns final string with replaced parameters
     */
    public function replaceString($string, $data = array())
    {
      preg_match_all("/{[^}]*}/", $string, $matches);
      if (sizeof($matches) > 0) {
        foreach ($matches[0] as $match) {
          $match = preg_replace('/[^a-zA-Z0-9_ \[\]\.\(\)%&-]/s', '', $match);

          if (isset($data[$match])) {
            $string = str_replace("{" . $match . "}", $data[$match], $string);
          }

          if (defined(strtoupper($match))) {
            $string = str_replace("{" . $match . "}", constant(strtoupper($match)), $string);
          }
        }
      }
      return $string;
    }

    /**
     * Strip the punctuation marks using regex from the provided text
     * @param String $text: Text string to be changed
     * @return String: Returns changed text after removing punctuation marks
     */
    public function stripPunctuation($text)
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
        $text
      );
    }

    /**
     * Generate SEO friendly strings for provided text input by removing unwanted words
     * and replacing spaces with provided replace character
     * @param String $input: String input to be changed
     * @param String $replace: Replace character or string for replacing spaces
     * @param Boolean $remove: If true will remove all unwanted words from the $removeWords array
     * @return String: Returns SEO friendly string of provided input string
     */
    public function generateSEOLink($input, $replace = '-', $remove = true)
    {

      $input = html_entity_decode(strtolower($input), ENT_NOQUOTES, "UTF-8");

      //make it lowercase, remove punctuation, remove multiple/leading/ending spaces
      $return = trim(preg_replace('[^\pL\pN\pP]', '', $this->stripPunctuation($input)));

      //remove words, if not helpful to seo
      //i like my defaults list in removeWords(), so I wont pass that array
      if ($remove) {
        $return = $this->removeWords($return, $replace);
      }

      //convert the spaces to whatever the user wants
      //usually a dash or underscore..
      //...then return the value.
      return str_replace(' ', $replace, $return);
    }

    /* takes an input, scrubs unnecessary words */
    public function removeWords($input, $replace, $unique_words = true)
    {

      //separate all words based on spaces
      $inputArray = explode(' ', $input); //print_r($inputArray);
      $inputArray = array_splice($inputArray, 0, 15);

      //create the return array
      $return = array();

      //loops through words, remove bad words, keep good ones
      foreach ($inputArray as $word) {
        //if it's a word we should add...
        if (!in_array($word, $this->removeWords) && ($unique_words ? !in_array($word, $return) : true)) {
          $return[] = str_replace($this->removeSymbols, "", $word);
        }
      }

      //return good words separated by dashes
      return implode($replace, $return);
    }
  }
