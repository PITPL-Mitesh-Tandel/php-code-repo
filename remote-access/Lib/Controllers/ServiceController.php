<?php
namespace Tapverse\MultiverseCMSSync\Lib\Controllers;

use Tapverse\MultiverseCMSSync\Lib\Controller;
use Tapverse\MultiverseCMSSync\Lib\Models\Service;

class ServiceController extends Controller
{
  public $template;

  public function viewService()
  {
    if (!$this->routes['slug']) {
      $this->view->display('pages/404');
    }

    $serviceModel = new Service();

    $filters = [
      "resultset" => "row",
      "where" => [
        "slug" => $this->routes['slug']
      ]
    ];
    $service = $serviceModel->getServicesByFilter($filters);

    if ($service === 404) {
      $this->view->display('pages/404');
    }

    $filters = [
      "resultset" => "data",
      "order" => ["main.position"],
    ];
    $services = $serviceModel->getServicesByFilter($filters);

    $this->view->display("pages/service-details", [
      'serviceDetails' => $service,
      'services' => $services,
      'seo' => [
        'meta_title' => $service['meta_title'],
        'meta_description' => $service['meta_description'],
      ],
    ]);
  }
}
