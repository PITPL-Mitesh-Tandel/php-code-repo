<?php

namespace Pseudocode\PDFReader\Lib\Models;

use Pseudocode\PDFReader\Lib\Model;

class Content extends Model
{
    private $coreTable = 'tblcontent';

    public function getContentsByFilter($filters)
    {

        $fields = isset($filters['resultset']) && $filters['resultset'] == 'count' ? 'count(main.id) as total_rows' : "main.*";

        $sql = "select ".$fields."
                from ".$this->coreTable." as main
                where true";

        return $this->db->getFilteredResult($sql, $filters);
    }
}