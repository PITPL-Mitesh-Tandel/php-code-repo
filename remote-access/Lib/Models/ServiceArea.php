<?php

namespace Tapverse\MultiverseCMSSync\Lib\Models;

use Tapverse\MultiverseCMSSync\Lib\Model;
use Tapverse\MultiverseCMSSync\Lib\Classes\StringFunction;

class ServiceArea extends Model
{
    private $coreTable = 'service_areas';

    public function getServiceAreasByFilter($filters) {

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
            'title' => $data['title'],
            'main_paragraph' => @$data['mainParagraph'],
            'paragraph2' => @$data['paragraph2'],
            'paragraph3' => @$data['paragraph3'],
            'paragraph4' => @$data['paragraph4'],
            'seo_title' => @$data['seoTitle'],
            'seo_description' => @$data['seoDescription'],
            'seo_keywords' => @$data['seoKeywords'],
            'slug' => $stringFunction->generateSEOLink($data['title']),
            'ref_id' => $data['ref_id']
        ];
    }

    public function saveServiceArea($requestData)
    {
        $filters = [
            'resultset' => 'count',
            'where' => [
                'ref_id' => $requestData['ref_id']
            ]
        ];

        $serviceAreaCount = $this->getServiceAreasByFilter($filters);

        $dataArray = $this->parseArray($requestData);

        try {
            if ($serviceAreaCount > 0) {
                $this->db->updateByArray($this->coreTable, $dataArray, "ref_id = '".$requestData['ref_id']."'");
            } else {
                $this->db->insertByArray($this->coreTable, $dataArray);
            }
        } catch (\Throwable $th) {
            error_log($th->getMessage());
        }
    }
}
