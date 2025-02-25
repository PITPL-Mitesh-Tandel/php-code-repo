<?php

  return [
    'requests' => [
      '/' => 'home|PageController|home|Home',
      '/articles' => 'articles|ArticleController|articles|Articles',
      '/sync/categories' => '|SyncController|syncCategories|',
      '/sync/articles' => '|SyncController|syncArticles|',
      '/sync/service-areas' => '|SyncController|syncServiceAreas|',
      '/entry-image/<slug>' => '|PageController|entryImage|',
    ],
    'params' => [
      'lang' => '[a-z]{2}', // regex url parametr <lang>
      'action' => '(contact|service|go|[a-z]{5,25})', // regex url parametr <action>
      'page' => '[0-9]{1,3}',
      'pagination' => '[0-9]{1,3}',
      'year' => '[0-9]{4}',
      'slug' => '[a-z0-9_\-]{1,100}',
      'name' => '[a-z0-9_\-.]{1,100}',
      'parent' => '[a-z0-9_\-]{1,100}',
      'type' => '[a-z0-9_\-]{1,25}',
      'num' => '[0-9]{4}',
      'size' => '[a-z]{1}',
    ]
  ];
