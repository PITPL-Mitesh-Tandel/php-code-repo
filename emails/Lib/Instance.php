<?php

/**
 * Main Application class which will handle all request
 * 
 * @version 1.1 (FileManager and Log class updated)
 */

namespace Pseudocode\VariousScripts\Lib;

class Instance
{

	protected $Routes;

	/**
	 * Constructor of the class.
	 * It loads all required system components required for the system.
	 */
	public function __construct($id = 'default')
	{
		self::instance($this, $id);
	}

	/**
	 * Get routes array of the request
	 */
	public function getRoutes()
	{
		return $this->Routes;
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
	public static function &instance($newInstance = null, $id = 'default')
	{
		static $instance = array();
		if (isset($newInstance) && is_object($newInstance))
			$instance[$id] = $newInstance;
		return $instance[$id];
	}
}
