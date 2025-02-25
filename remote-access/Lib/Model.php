<?php
/**
 * Model helper class
 *
 * @version 1.0
 */

namespace Tapverse\MultiverseCMSSync\Lib;

class Model {

  public $db = null;
  
  // Contructor class
  public function __construct() {
    $this->db = Instance::instance()->checkDB();
  }

  public function lastInsertId() {
    return $this->db->lastInsertId();
  }

  public function checkDuplicate() {
    return $this->db->duplicateRow;
  }

  public function viewQuery() {
    return $this->db->lastQuery;
  }
}
