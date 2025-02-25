<?php

  /**
   * DB PDO Class
   * This class aids in MySQL database connectivity. It was written with
   * my specific needs in mind.  It simplifies the database tasks I most
   * often need to do thus reducing redundant code.  It is also written
   * with the mindset to provide easy means of debugging erronous sql and
   * data during the development phase of a web application.
   *
   * The future may call for adding a slew of other features, however, at
   * this point in time it just has what I often need.  I'm not trying to
   * re-write phpMyAdmin or anything.  :)  Hope you find it  useful.
   *
   * @package  System
   * @author  Mitesh Tandel <mits.tandel@gmail.com>
   * @version  2.0
   *
   *      Copyright:  (c) 2005 - Mitesh Tandel
   *                  You are free to use, distribute, and modify this software
   *                  under the terms of the GNU General Public License.  See the
   *                  included license.txt file.
   *
   *
   *  VERION HISTORY:
   *
   *      v2.0 [04.09.2018] - Implemented Namespaces
   */

  namespace Tapverse\MultiverseCMSSync\Lib\Classes;

  class DbPDO {

    private $lastError;         // holds the last error. Usually mysql_error()
    private $lastErrorNo;      // holds the last error no. Usually mysql_errno()
    private $lastQuery;         // holds the last query executed.
    private $lastInsertId;    // holds the last insert id

    private $dbtype;   // Database Type
    private $host;               // Host to connect to
    private $user;               // User name
    private $pw;                 // Password
    private $db;                 // Database to select
    
    private $stmt;

    private $conn;            // current/last database link identifier
    private $totalRows;      // holds the total rows from the last query

    private $perpage;      // holds the perpage records for paging
    private $begin;        // holds the value of records start count

    private $prepare;
    private $connectQuery = false;
    private $displayErrors = true;
    private $fetchType = 'ASSOC';
    private $columnTypes = [];

    /**
     * Constructure of the class
     * Setup your own default values for connecting to the database here. You
     * can also set these values in the connect() function
     */
    public function __construct() {
    
      $this->dbtype = env('DB_TYPE');
      $this->host = env('DB_SERVER');
      $this->user = env('DB_USERNAME');
      $this->pw = env('DB_PASSWORD');
      $this->db = env('DB_SCHEMA');

      $this->connect();
    }
    
    /** Connects the database using access details provided
     * @params $host: host name/ip address of the connecting database server
     *     $user: username for the database
     *     $pw: password for the database
     *     $db: database name to be connected
     *     $type: format of the data for unicode
     * @returns true if connected successfully else false
     */
    public function connect($host='', $user='', $pw='', $db='') {
    
      if (!empty($host)) {
        $this->host = $host;
      }
      if (!empty($user)) {
        $this->user = $user;
      }
      if (!empty($pw)) {
        $this->pw = $pw;
      }
      if (!empty($db)) {
        $this->db = $db;
      }
    
      $options = array(
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION
      );

      if ($this->dbtype == 'mysql') {
        $options[\PDO::ATTR_PERSISTENT] = true;
        $options[\PDO::MYSQL_ATTR_INIT_COMMAND] = "SET NAMES utf8";
      }

      switch($this->dbtype) {
        case 'oci':
          $dsn = $this->dbtype.':dbname='.$this->host.'/'.$this->db;
          break;
        case 'sqlite':
          $dsn = $this->dbtype.':'.$this->db;
          break;
        default:
          $dsn = $this->dbtype.':host='.$this->host.';dbname='.$this->db;
          break;
      }
      
      try {
        $this->conn = new \PDO($dsn, $this->user, $this->pw, $options);
      } catch(\PDOException $e) {
        $this->lastError = $e->getMessage();
        die('Connection ERROR: Code '.$e->getMessage());
      }
      
      return true;  // success
    }
      
    public function setFetchType($fetch) {
      $this->fetchType = $fetch;
    }

    public function setPrepare($data) {

      if (!isset($data) || sizeof($data) == 0) {
        $this->lastError = "You must pass an array to the setPrepare() function";
        $this->printLastError();
        return false;
      }

      $this->prepare = $data;
    }

    /**
     * Generate filtered result from provided filters and sql query
     * @param string $sql: SQL query string to execute
     * @param array $filters: Array of filters applied on provided query
     * @return array | int: Returns array of results in case of resultset is data or row if successful,
     *             returns number of records in case of resultset is count if successful,
     *             returns 404 if failure
     * @throws Exception If resultset is not provided in filters
     */
    public function getFilteredResult($sql, $filters) {

      $whereSigns = array(
        'greater' => ' > ',
        'lesser' => ' < ',
        'greater-equal' => ' >= ',
        'lesser-equal' => ' <= ',
        'like' => ' like ',
        'not-equal' => ' != ',
        'equal' => ' = '
      );

      $bindArray = $whereArray = array(); $k = 1;
      if (isset($filters['where']) && is_array($filters['where'])) {
        foreach ($filters['where'] as $key => $value) {
          if (is_array($value) && in_array($key, array_keys($whereSigns))) {
            $k1 = 1;
            foreach ($value as $key1 => $value1) {
              if (!empty($value1)) {
                $newKey = ':key'.$k.$k1;
                $bindArray[$newKey] = $value1;
                $whereArray[] = $key1.$whereSigns[$key].$newKey;
              } else {
                $whereArray[] = $key1;
              }
              $k1++;
            }
          } else {
            if (!is_numeric($key)) {
              $newKey = ':key'.$k;
              $bindArray[$newKey] = $value;
              $whereArray[] = $key.' = '.$newKey;
            } else {
              $whereArray[] = $value;
            }
          }
          $k++;
        }
      }
      
      if (isset($filters['like']) && is_array($filters['like'])) {
        foreach ($filters['like'] as $key => $value) {
          if (!empty($value)) {
            $newKey = ':key'.$k++;
            $bindArray[$newKey] = $value;
            $whereArray[] = $key." like ".$newKey;
          } else {
            $whereArray[] = $key;
          }
        }
      }

      if (isset($filters['between']) && is_array($filters['between'])) {
        foreach ($filters['between'] as $key => $value) {
          $startKey = ':startKey'.$k;
          $endKey = ':endKey'.$k++;
          $bindArray[$startKey] = $value[0];
          $bindArray[$endKey] = $value[1];
          $whereArray[] = $key." between ".$startKey." and ".$endKey;
        }
      }
      
      if (isset($filters['in']) && is_array($filters['in'])) {
        foreach ($filters['in'] as $field => $values) {
          $inArray = array(); $k = 1;
          foreach ($values as $key => $value) {
            $newKey = ':key'.$k++;
            $bindArray[$newKey] = $value;
            $inArray[] = $newKey;
          }
          $whereArray[] = $field." in (".implode(", ", $inArray).")";
        }
      }
      
      if (isset($filters['not']) && is_array($filters['not'])) {
        foreach ($filters['not'] as $key => $value) {
          if (!empty($value)) {
            $newKey = ':key'.$k++;
            $bindArray[$newKey] = $value;
            $whereArray[] = $key.' != '.$newKey;
          } else {
            $whereArray[] = $key;
          }
        }
      }

      $whereStr = sizeof($whereArray) > 0 ? " and ".implode(" and ", $whereArray) : '';

      $orderBy = isset($filters['order']) ? " order by ".implode(", ", $filters['order']) : '';

      $groupBy = isset($filters['group']) ? " group by ".implode(", ", $filters['group']) : '';

      $sql .= $whereStr.$groupBy.$orderBy;
      
      if (sizeof($bindArray) > 0) {
        $this->setPrepare($bindArray);
      }
      
      switch($filters['resultset']) {
        case 'row':
          $return = $this->getResult($sql);
          break;
        case 'count':
          $data = $this->getResult($sql);
          $return = $data['total_rows'];
          break;
        case 'data':
          $return = $this->getResults($sql);
          break;
        default:
          throw new \PDOException('ERROR! Invalid resultset provided');
          break;
      }

      return $return;
    }
      
    /**
    * Execute provided query for select statement
    * assign prepare values if available
    * @param string $sql: Query string to be executed
    * @return object | boolean: Returns result resource object on success, otherwise returns false
    */
    public function select($sql) {

      if ($this->perpage != 0) {
        switch($this->dbtype) {
          case 'oci':
            $sql .= " OFFSET ".$this->begin." ROWS FETCH NEXT ".$this->perpage." ROWS ONLY";
            break;
          default:
            $sql .= " LIMIT ".$this->begin.", ".$this->perpage;
            break;
        }
      }

      $this->lastQuery = $sql; //pr($this->conn, false);
    
      try {
        if (isset($this->prepare) && sizeof($this->prepare) > 0) {
          $r = $this->conn->prepare($sql);
          $r->execute($this->prepare);
        } else {
          $r = $this->conn->query($sql);
        }
        $this->totalRows = $r->rowCount();
        unset($this->prepare);
      } catch(\PDOException $e) {
        $this->lastError = $e->getMessage();
        $this->printLastError();
        return false;
      }
      
      return $r;
    }

    public function delete($table, $where) {
      $sql = "delete from $table where $where";
      return $this->executeSql($sql);
    }

    public function getRows($result) {

      // Returns a row of data from the query result.  You would use this
      // function in place of something like while($row=mysql_fetch_array($r)).
      // Instead you would have while($row = $db->getRow($r)) The
      // main reason you would want to use this instead is to utilize the
      // auto_slashes feature.

      if ($this->fetchType == 'ASSOC') {
        $row = $result->fetchAll(\PDO::FETCH_ASSOC);
      }
      if ($this->fetchType == 'NUM') {
        $row = $result->fetchAll(\PDO::FETCH_NUM);
      }
      if ($this->fetchType == 'BOTH') {
        $row = $result->fetchAll(\PDO::FETCH_BOTH);
      }
      if ($this->fetchType == 'OBJ') {
        $row = $result->fetchAll(\PDO::FETCH_OBJ);
      }
    
      return $row;
    }
    
    public function getRow($result) {
      try{
        if ($this->fetchType == 'ASSOC') {
          $row = $result->fetch(\PDO::FETCH_ASSOC);
        }
        if ($this->fetchType == 'NUM') {
          $row = $result->fetch(\PDO::FETCH_NUM);
        }
        if ($this->fetchType == 'BOTH') {
          $row = $result->fetch(\PDO::FETCH_BOTH);
        }
        if ($this->fetchType == 'OBJ') {
          $row = $result->fetch(\PDO::FETCH_OBJ);
        }
      
        return $row;
      } catch(\PDOException $e) {
        $this->lastError = $e->getMessage();
        $this->printLastError();
        return false;
      }
    }
    
    public function insertRow($sql, $data) {
      // Inserts data in the database via SQL query.
      // Returns the id of the insert or true if there is not auto_increment
      // column in the table.  Returns false if there is an error.

      $this->lastQuery = $sql;
        
      try {
        $r = $this->conn->prepare($sql);
        $r->execute($data);
      } catch(\PDOException $e) {
        $this->lastError = $e->getMessage();
        
        $errorInfo = $e->errorInfo;
        $this->lastErrorNo = $errorInfo[1];
        
        if (in_array($errorInfo[1], array(1062))) {
          $this->displayErrors = false;
        }
        
        $this->printLastError();
        return false;
      }
    
      $this->lastInsertId = $this->conn->lastInsertId();
      return $this->lastInsertId;
    }
    
    /** Get all column data type information for table provided
     * @params  $table: name of the table
    * @returns an array of all fields with data type information of false if there is an error
    */
    public function getColumnNames($table) {
      
      switch($this->dbtype) {
        case 'sqlite':
          $sql = 'PRAGMA table_info('.$table.')';
          $fieldKey = 'name';
          $typeKey = 'type';
          break;
        default:
          $sql = 'SHOW COLUMNS FROM ' . $table;
          $fieldKey = 'Field';
          $typeKey = 'Type';
          break;
      }
      
      $this->stmt = $this->conn->prepare($sql);
        
      try {
        if ($this->stmt->execute()){
          $columnData = $this->stmt->fetchAll(); //pr($columnData);
          
          foreach ($columnData as $array){
            foreach ($array as $innerKey => $value){
                
              if ($innerKey === $fieldKey && !(int)$innerKey){
                $field = $value;
              }
              
              if ($innerKey === $typeKey && !(int)$innerKey){
                $this->columnTypes[$table][$field] = $value;
              }
            }
          }
        }
        
        return true;
      } catch (\PDOException $e){
        $this->lastError = $e->getMessage();
        $this->printLastError();
        return false;
      }
    }

    public function executeSql($sql) {

      // Updates data in the database via SQL query.
      // Returns the number or row affected or true if no rows needed the update.
      // Returns false if there is an error.

      $this->lastQuery = $sql;
    
      try {
        if (isset($this->prepare) && sizeof($this->prepare) > 0) {
          $r = $this->conn->prepare($sql);
          $r->execute($this->prepare);
        } else {
          $r = $this->conn->query($sql);
        }
        $this->totalRows = $r->rowCount();
        unset($this->prepare);
      } catch(\PDOException $e) {
        $this->lastError = $e->getMessage();
        $this->printLastError();
        return false;
      }
    
      return $this->totalRows;
    }
    
    /**  Inserts a row into the database table from key->value pairs in an array
     * @params $table: name of the table for insertion
    *     $data: array of the data with key->value pair of table fields as a key
    * @returns id of the row inserted otherwise false on failure
    */
    public function insertByArray($table, $data, $action = 'INSERT') {
    
      if (empty($data)) {
        $this->lastError = "You must pass an array to the insertByArray() function.";
        $this->printLastError();
        return false;
      }
      
      if (!isset($this->columnTypes[$table])) {
        $this->getColumnNames($table);
      }
    
      $cols = '('.implode(", ", array_keys($data)).')';
      $newData = array();
    
      foreach ($data as $key => $value) {     // iterate values to input
      
        if (!isset($this->columnTypes[$table][$key])) {
          $this->lastError = "Undefined column '".$key."' in table '".$table."'";
          $this->printLastError();
          return false;  // error!
        }
        
        $k = ":$key";
        $newData[$k] = $value;
      }
    
      $values = '('.implode(", ", array_keys($newData)).')';
    
      // insert values
      $sql = $action." INTO $table $cols VALUES $values";
      return $this->insertRow($sql, $newData);
    }

      /**  Updates a row into the database table provided from key->value pairs in an array
     * @params $table: name of the table to be updated
    *     $data: array of the data with key->value pair of table fields as a key
    *     $condition: a WHERE clause (without the WHERE).
    *           For example, "column=value AND column2='another value'" would be a condition.
    * @returns the number or row affected or true if no rows needed the update otherwise false on failure
    */
    public function updateByArray($table, $data, $condition) {
    
      if (empty($data)) {
        $this->lastError = "You must pass an array to the updateByArray() function.";
        $this->printLastError();
        return false;
      }
    
      if (!isset($this->columnTypes[$table])) {
        $this->getColumnNames($table);
      }
      
      $newData = array();
      if (isset($this->prepare) && sizeof($this->prepare) > 0) {
        $newData = $this->prepare;
      }
      
      $sql = "UPDATE $table SET";
      foreach ($data as $key => $value) {     // iterate values to input
      
        $sql .= " $key=";
        
        if (!isset($this->columnTypes[$table][$key])) {
          $this->lastError = "Undefined column '".$key."' in table '".$table."'";
          $this->printLastError();
          return false;  // error!
        }
        
        $k = ":$key";
        $newData[$k] = $value;
        
        $sql .= ":$key,";
      }

      $this->setPrepare($newData);

      $sql = rtrim($sql, ','); // strip off last "extra" comma
      if (!empty($condition)) {
        $sql .= " WHERE $condition";
      }
      
      return $this->executeSql($sql);
    }
      
    /**  Inserts a row into the database table from key->value pairs in an array
     * @params $table: name of the table for insertion
    *     $data: array of the data with key->value pair of table fields as a key
    * @returns id of the row inserted otherwise false on failure
    */
    public function multiInsertByArray($table, $data, $action = 'INSERT') {
    
      if (empty($data)) {
          $this->lastError = "You must pass an array to the multiInsertByArray() function.";
          $this->printLastError();
          return false;
      }
    
      $cols = '('.implode(", ", array_keys($data[0])).')';
      $newData = array();
        
      foreach ($data[0] as $key => $value) {
        if (!isset($this->columnTypes[$table][$key])) {
          $this->lastError = "Undefined column '".$key."'";
          $this->printLastError();
          return false;  // error!
        }
      }
    
      $values = array();
      foreach ($data as $i => $dataArray) {     // iterate values to input

        $newKeys = array();
        foreach ($dataArray as $key => $value) {     // iterate values to input
          $k = ":$key$i";
          $newData[$k] = $value;
          $newKeys[] = $k;
        }

        $values[] = '('.implode(", ", $newKeys).')';
      } //pr($newData);

      $allValues = implode(", ", $values);
    
      // insert values
      $sql = $action." INTO $table $cols VALUES $allValues";
      return $this->insertRow($sql, $newData);
    }

    // Get multiple rows from select query
    // By Mitesh Tandel 17-07-2013
    public function getResults($sql) {
      $result = $this->select($sql);
      
      if ($result) {
        $data = $this->getRows($result);
      } else {
        return 404;
      }
      
      if (!$data) {
        return 404;
      }
      
      return $data;
    }

    // Get single row from select query
    // By Mitesh Tandel 20-07-2013
    public function getResult($sql) {
      $result = $this->select($sql);
      
      if ($result) {
        $data = $this->getRow($result);
      } else {
        return 404;
      }
      
      if (!$data) {
        return 404;
      }
      
      return $data;
    }
    
    public function printLastError($showQuery = true) {
    
      // Prints the last error to the screen in a nicely formatted error message.
      // If $showQuery is true, then the last query that was executed will
      // be displayed aswell.
      
      if ($showQuery && (!empty($this->lastQuery)) && $this->displayErrors) {
        $this->printLastQuery();
      }
    
      if ($this->displayErrors || $this->connectQuery) {

        echo '<div style="border: 1px solid red; font-size: 9pt; font-family: monospace; color: red; padding: .5em; margin: 8px; background-color: #FFE2E2">
        <span style="font-weight: bold">Error:</span><br> ';
        echo $this->lastError;
        echo '</div>';
        
        //$this->stop();
        
        exit();
      }

    }

    public function printLastQuery() {
    
      // Prints the last query that was executed to the screen in a nicely formatted
      // box.
      
      
      echo '<div style="border: 1px solid blue; font-size: 9pt; font-family: monospace; color: blue; padding: .5em; margin: 8px; background-color: #E6E5FF"><span style="font-weight: bold">Last SQL Query:</span> '.str_replace("\n", " ", $this->lastQuery).'</div>';
      
    }
  }
