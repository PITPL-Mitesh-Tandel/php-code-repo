(function() {
  var module = angular.module('dada.news', []);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-news', {
        url: '/:lang/news',
        templateUrl: 'assets/frontend/partials/pages/news/index.html',
        controller: 'NewsController as nc',
        params: {
          id: { value: null }
        },
        sources: ['news']
      })

      .state('pages-news-show', {
        url: '/:lang/news/:article',
        templateUrl: 'assets/frontend/partials/pages/news/show.html',
        controller: 'NewsItemController as nc',
        sources: ['news']
      });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.news');

  module.controller('NewsController', [
    '$stateParams',
    '$scope',
    'newsResolverFactory',

    function($stateParams,$scope, news) 
    {
      var controller = this;
      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        $scope.setBreadcrumbs([{ 'title': 'NEWS', 'ref': 'pages-news', 'color': 'news' }]);
        $scope.language = $stateParams.lang;
          //console.log('Header Display:' + $scope.headerDisplay);

        var onLoad = function(data) {
          controller.news = data;
          controller.inView = function(card) {
            card.visible = true;
          };

          $scope.$emit('animate.enter');
        }.bind(this);

          $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

        news.getAll().then(onLoad);
      });
    }
  ]);

  module.controller('NewsItemController', [

    '$scope',
    '$stateParams',
    'newsResolverFactory',

    function($scope, $stateParams, news) 
    {
      var controller = this;
       $scope.language = $stateParams.lang;
      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        var onLoad = function(data) {
          controller.news = data;
          $scope.setBreadcrumbs([
            { 'title': 'NEWS', 'ref': 'pages-news', 'color': 'news' },
            { 'title': controller.news.title }
          ]);

            $scope.setHeaderDisplay(false); 
            //console.log($scope.headerDisplay);

          $scope.$emit('animate.enter');
        }.bind(this);

        news.get($stateParams.article).then(onLoad);
      });
    }
  ]);
})();

(function () {
  'use strict';

  var module = angular.module('dada.news');
  
  module.factory('newsResolverFactory', ['$http', 'newsFactory', function($http, News) {
    function format(item) {
      var model = new News();
      model.populate('news', item);
      return model;
    }

    /**
     * Inverted the parameters to reverse the sort order.
     */
    function sort(b, a) {
      a = new Date(a.date);
      b = new Date(b.date);
      return a > b ? -1 : a < b ? 1 : 0;
    }

    return {
      getAll: function () {
        return $http({method: 'GET', cache: true, url: 'http://www.appdemo.co.in/atelier/content/0.1/get-contents?type=n'})
          .then(function (result) {
            var promoted = result.data.filter(function(item) {
              return item.promoted == true;
            }).sort(sort);

            var normal = result.data.filter(function(item) {
              return item.promoted == false;
            }).sort(sort);

            return promoted.concat(normal).map(format);
          });
      },

      get: function(slug) {
        return this.getAll()
          .then(function(response) {
            return response.find(function(item) {
              return item['title-slug'] == slug;
            })
          })
      }
    };
  }]);
})();
