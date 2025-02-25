<?php

    namespace Tapverse\MultiverseCMSSync\Lib\Classes;

    class Route
    {
        //TRAP REQUESTS ARRAY:
        public static $request;
        public static $param;

        public static function match($uri = null) {
            $routes = require_once env('SITE_PATH').'/Config/route.php';
            self::$request = $routes['requests'];
            self::$param = $routes['params'];
            
			if (!empty(self::$request)) {
                foreach (self::$request as $req => $params) { //echo $req;

                    if ($req == $uri) {
                        $t['config'] = $params;
                        return $t;
                    }

                    $req = preg_replace_callback("/\<(?P<key>[0-9a-z_]+)\>/", self::class.'::_replacer', str_replace(")",")?", $req));
                    if (($t = self::_reportRulle($req, $uri))) {
                        $t['config'] = $params;
                        return $t;
                    }
                }
            } else return array();
        }

        private static function _replacer($matches) {
            if(isset(self::$param[$matches['key']])) {
                return "(?P<".$matches['key'].">".self::$param[$matches['key']].")";
            } else return "(?P<".$matches['key'].">"."([^/]+)".")";
        }

        private static function _reportRulle($req, $uri) {
            if($req and $uri) { //echo "#^".$ini_array['request']."$#"; echo $uri;
                if(preg_match("#^".$req."$#", $uri, $match)){
                    $r = array_merge((array)$req, (array)$match);
                    foreach($r as $k => $v)
                        if((int)$k OR $k == 'param' OR $k == 'request')
                            unset($r[$k]);
                    return $r;
                }
            }
        }
        /** =================================================================== **/
    }
