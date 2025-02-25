<?php

namespace Tapverse\MultiverseCMSSync\Lib\Models;

use Tapverse\MultiverseCMSSync\Lib\Model;
use Tapverse\MultiverseCMSSync\Lib\Classes\StringFunction;

class Article extends Model
{
    private $coreTable = 'articles';
    private $articleCategoryTable = 'article_categories';

    public function getArticlesByFilter($filters) {

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
            'description' => @$data['description'],
            'entry_date' => $data['entryDate'],
            'entry_image' => $data['entryImage'],
            'seo_title' => $data['seoTitle'],
            'seo_description' => $data['seoDescription'],
            'seo_keywords' => $data['seoKeywords'],
            'slug' => $stringFunction->generateSEOLink($data['title']),
            'ref_id' => $data['ref_id']
        ];
    }

    public function saveArticle(array $requestData)
    {
        $filters = [
            'resultset' => 'row',
            'where' => [
                'ref_id' => $requestData['ref_id']
            ]
        ];

        $article = $this->getArticlesByFilter($filters);

        $dataArray = $this->parseArray($requestData); //pr($dataArray, false);

        if ($article != 404) {
            $this->db->updateByArray($this->coreTable, $dataArray, "ref_id = '".$requestData['ref_id']."'");
            return $article['id'];
        } else {
            return $this->db->insertByArray($this->coreTable, $dataArray);
        }
    }

    public function saveArticleCategories(array $articleCategories)
    {
        foreach ($articleCategories as $articleId => $categories) { //pr($articleId);
            $this->db->delete($this->articleCategoryTable, "article_id = ".$articleId);

            foreach ($categories as $categoryId) {
                $dataArray = [
                    'article_id' => $articleId,
                    'category_id' => $categoryId,
                ];

                $this->db->insertByArray($this->articleCategoryTable, $dataArray);
            }
        }
    }
}
