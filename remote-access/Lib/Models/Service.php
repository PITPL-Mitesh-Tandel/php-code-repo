<?php

namespace Tapverse\MultiverseCMSSync\Lib\Models;

use Tapverse\MultiverseCMSSync\Lib\Model;

class Service extends Model
{
    private $coreTable = 'services';
    public function getServicesByFilter($filters) {

        $fields = isset($filters['resultset']) && $filters['resultset'] == 'count' ? 'count(main.id) as total_rows' : "main.*";

        $sql = "select ".$fields." 
                from ".$this->coreTable." as main 
                where 1";

        return $this->db->getFilteredResult($sql, $filters);
    }
}