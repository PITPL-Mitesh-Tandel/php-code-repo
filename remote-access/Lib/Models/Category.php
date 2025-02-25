<?php

namespace Tapverse\MultiverseCMSSync\Lib\Models;

use Tapverse\MultiverseCMSSync\Lib\Model;
use Tapverse\MultiverseCMSSync\Lib\Classes\StringFunction;

class Category extends Model
{
    private $coreTable = 'categories';
    public function getCategoriesByFilter($filters) {

        $fields = isset($filters['resultset']) && $filters['resultset'] == 'count' ? 'count(main.id) as total_rows' : "main.*";

        $sql = "select ".$fields."
                from ".$this->coreTable." as main
                where 1";

        return $this->db->getFilteredResult($sql, $filters);
    }

    public function parseArray($data)
    {
        $stringFunction = new StringFunction;

        return [
            'name' => $data['title'],
            'description' => @$data['description'],
            'slug' => $stringFunction->generateSEOLink($data['title']),
            'ref_id' => $data['ref_id']
        ];
    }

    public function saveCategory($requestData)
    {
        $filters = [
            'resultset' => 'count',
            'where' => [
                'ref_id' => $requestData['ref_id']
            ]
        ];

        $categoryCount = $this->getCategoriesByFilter($filters);

        $dataArray = $this->parseArray($requestData);

        try {
            if ($categoryCount > 0) {
                $this->db->updateByArray($this->coreTable, $dataArray, "ref_id = '".$requestData['ref_id']."'");
            } else {
                $this->db->insertByArray($this->coreTable, $dataArray);
            }
        } catch (\Throwable $th) {
            error_log($th->getMessage());
        }
    }
}
