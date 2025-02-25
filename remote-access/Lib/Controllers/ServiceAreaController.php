<?php
namespace Tapverse\MultiverseCMSSync\Lib\Controllers;

use Tapverse\MultiverseCMSSync\Lib\Controller;
use Tapverse\MultiverseCMSSync\Lib\Models\ServiceArea;
use Tapverse\MultiverseCMSSync\Lib\Models\Category;
use Tapverse\MultiverseCMSSync\Lib\Models\Service;

class ServiceAreaController extends Controller
{
  public $template;

  public function viewServiceArea()
  {
    if (!$this->routes['slug']) {
      $this->view->display('pages/404');
    }

    $serviceAreaModel = new ServiceArea();

    $filters = [
      "resultset" => "row",
      "where" => [
        "slug" => $this->routes['slug']
      ]
    ];
    $serviceArea = $serviceAreaModel->getServiceAreasByFilter($filters);

    if ($serviceArea === 404) {
      $this->view->display('pages/404');
    }

    $serviceModel = new Service;
    $filters = [
      "resultset" => "data",
      "order" => ["main.position", "main.name"],
    ];
    $services = $serviceModel->getServicesByFilter($filters);

    $this->view->display("pages/service-area-details", [
      'serviceAreaDetails' => $serviceArea,
      'services' => $services,
      'seo' => [
        'meta_title' => $serviceArea['seo_title'],
        'meta_description' => $serviceArea['seo_description'],
      ],
    ]);
  }
}
