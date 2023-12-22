<?php 
/**
 * Main Application class which will handle all request
 * 
 * @version 1.1 (FileManager and Log class updated)
 */

namespace Pseudocode\PDFReader\Lib;

use Pseudocode\PDFReader\Lib\View;

class Instance {

	protected $View;
	protected $Routes;

	/**
	 * Constructor of the class.
	 * It loads all required system components required for the system.
	 */
	public function __construct($id = 'default') {
		self::instance($this, $id);
		$this->View = new View;
    }

	/**
	 * Get routes array of the request
	 */
	public function getRoutes() {
		return $this->Routes;
	}

	/**
	 * Get view object of the request
	 */
	public function getView() {
		return $this->View;
	}

	/**
     * instance
     *
     * get/set the tmvc object instance(s)
     *
     * @access	public
     * @param   object $newInstance reference to new object instance
     * @param   string $id object instance id
     * @return  object $instance reference to object instance
     */    
    public static function &instance($newInstance = null, $id='default') {
        static $instance = array();
        if(isset($newInstance) && is_object($newInstance))
        	$instance[$id] = $newInstance;
        return $instance[$id];
    }	
}
