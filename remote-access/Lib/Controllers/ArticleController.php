<?php
namespace Tapverse\MultiverseCMSSync\Lib\Controllers;

use Tapverse\MultiverseCMSSync\Lib\Controller;
use Tapverse\MultiverseCMSSync\Lib\Models\Article;
use Tapverse\MultiverseCMSSync\Lib\Models\Category;
use Tapverse\MultiverseCMSSync\Lib\Models\Service;

class ArticleController extends Controller
{
  public $template;

  public function articles()
  {
    $articleModel = new Article();
    
    $filters = [
      "resultset" => "data",
    ];
    $articles = $articleModel->getArticlesByFilter($filters); pr($articles);

    if ($articles === 404) {
      $this->view->display('pages/404');
    }
  }

  public function viewArticle()
  {
    if (!$this->routes['slug']) {
      $this->view->display('pages/404');
    }

    $articleModel = new Article();
    $categoryModel = new Category();

    $filters = [
      "resultset" => "row",
      "where" => [
        "slug" => $this->routes['slug']
      ]
    ];
    $article = $articleModel->getArticlesByFilter($filters);

    if ($article === 404) {
      $this->view->display('pages/404');
    }

    $filters = [
      'resultset' => 'data',
      'order' => ['name'],
    ];
    $categories = $categoryModel->getCategoriesByFilter($filters);

    $serviceModel = new Service;
    $filters = [
      "resultset" => "data",
      "order" => ["main.position", "main.name"],
    ];
    $services = $serviceModel->getServicesByFilter($filters);

    $this->view->display("pages/article-details", [
      'articleDetails' => $article,
      'categories' => $categories,
      'services' => $services,
      'seo' => [
        'meta_title' => $article['seo_title'],
        'meta_description' => $article['seo_description'],
      ],
    ]);
  }
}
