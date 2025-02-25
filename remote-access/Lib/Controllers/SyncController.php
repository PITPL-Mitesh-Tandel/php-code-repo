<?php

namespace Tapverse\MultiverseCMSSync\Lib\Controllers;

use GuzzleHttp\Client;
use Tapverse\MultiverseCMSSync\Lib\Controller;
use Tapverse\MultiverseCMSSync\Lib\Models\Article;
use Tapverse\MultiverseCMSSync\Lib\Models\Category;
use Tapverse\MultiverseCMSSync\Lib\Models\ServiceArea;

class SyncController extends Controller
{
  public $client;

  public function __construct()
  {
    $this->client = new Client();
  }

  public function fetchEntries(string $id)
  {
    $entriesApi = env('CMS_BASE_URL') . '/private/entries/list';

    $response = $this->client->request(
      'POST',
      $entriesApi,
      array(
        'form_params' => array(
          'id' => $id,
          'projectId' => '9b939099-9f4c-4fa7-94b4-a310e0472558'
        )
      )
    );

    $content = $response->getBody()->getContents();

    if ($response->getStatusCode() == 200) {
      return json_decode($content);
    }

    return false;
  }

  public function syncCategories()
  {
    $categoryModel = new Category;

    $categoriesList = $this->fetchEntries('9b7db748-a2f1-483f-9caf-4960ce808618'); //pr($categoriesList);

    if ($categoriesList == false) {
      die('ERROR');
    }

    if ($categoriesList->hasError === true) {
      die('ERROR');
    }

    $dataArray = [];
    foreach ($categoriesList->list as $category) { //pr($category);
      $dataArray['ref_id'] = $category->id;
      if (sizeof($category->values) > 0) {
        foreach ($category->values as $field) {
          $key = $field->key;
          $dataArray[$key] = $field->value;
        }
      }
      //pr($dataArray);
      $categoryModel->saveCategory($dataArray);
    }
  }

  public function syncArticles()
  {
    $articleModel = new Article;
    $categoryModel = new Category;

    $articlesList = $this->fetchEntries('9b73aaba-16d5-4581-94c8-91be29e39129'); //pr($articlesList);

    if ($articlesList == false) {
      die('ERROR');
    }

    if ($articlesList->hasError === true) {
      die('ERROR');
    }

    $categories = $categoryModel->getCategoriesByFilter([
      'resultset' => 'data',
    ]);

    $categoryMapping = [];
    if ($categories != 404) {
      foreach ($categories as $category) {
        $categoryRefId = $category['ref_id'];
        $categoryMapping[$categoryRefId] = $category['id'];
      }
    }

    $dataArray = [];
    $errors = [];
    foreach ($articlesList->list as $article) { //pr($article);
      $dataArray['ref_id'] = $article->id;
      $articleCategories = [];
      $allArticleCategories = [];
      if (sizeof($article->values) > 0) {
        foreach ($article->values as $field) {
          $key = $field->key;

          if (isset($field->file)) {
            $fileName = $article->id . '.' . pathinfo($field->file->url, PATHINFO_EXTENSION);
            $photoPath = env('SITE_PATH') . '/public/default/images/articles/' . $fileName;
            $photoFile = file_get_contents($field->file->url);

            file_put_contents($photoPath, $photoFile);
            $dataArray[$key] = $fileName;
          } elseif (isset($field->multiValues) && sizeof($field->multiValues) > 0) {
            foreach ($field->multiValues as $value) {
              $articleCategories[] = $value->ref_id;
            }
          } else {
            $dataArray[$key] = $field->value;
          }
        }
      }
      // pr($dataArray);
      $result = $articleModel->saveArticle($dataArray);

      if (sizeof($articleCategories) > 0) {

        $newArticleCategories = [];
        foreach ($articleCategories as $row) {

          if (!isset($categoryMapping[$row])) {
            $errors[] = 'Category mapping failed: [' . $row . ']';
            continue;
          }

          $newArticleCategories[] = $categoryMapping[$row];
        }

        $allArticleCategories[$result] = $newArticleCategories; //pr($allArticleCategories, false);

        $articleModel->saveArticleCategories($allArticleCategories);
      }
    }
  }

  public function syncServiceAreas()
  {
    $serviceAreaModel = new ServiceArea;

    $serviceAreasList = $this->fetchEntries('9b7bb4be-13a4-4194-a0bb-ed15458d6472'); //pr($serviceAreasList);

    if ($serviceAreasList == false) {
      die('ERROR');
    }

    if ($serviceAreasList->hasError === true) {
      die('ERROR');
    }

    $dataArray = [];
    foreach ($serviceAreasList->list as $serviceArea) { //pr($serviceArea);
      $dataArray['ref_id'] = $serviceArea->id;
      if (sizeof($serviceArea->values) > 0) {
        foreach ($serviceArea->values as $field) {
          $key = $field->key;
          $dataArray[$key] = $field->value;
        }
      }
      //pr($dataArray);
      $serviceAreaModel->saveServiceArea($dataArray);
    }
  }
}
