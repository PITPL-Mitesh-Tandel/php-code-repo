(function() {
  var module = angular.module('dada.publications', []);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-publications', {
        url: '/:lang/publications',
        templateUrl: 'assets/frontend/partials/pages/publications/index.html',
        controller: 'PublicationsController as pc',
        params: {
          id: { value: null }
        },
        sources: ['studios','publications']
      })

      .state('pages-publications-show', {
        url: '/:lang/publications/:article',
        templateUrl: 'assets/frontend/partials/pages/publications/show.html',
        controller: 'PublicationsController as pc',
        sources: ['publications']
      });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.publications');

  module.controller('PublicationsController', [

    '$scope',
    'publicationsResolverFactory',

    function($scope, publications) {
      var controller = this;
      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        $scope.setBreadcrumbs([{ 'title': 'PUBLICATIONS', 'ref': 'pages-publications', 'color': 'studios' }]);
          //console.log('Header Display:' + $scope.headerDisplay);

        var onLoad = function(data) {
          controller.publications = data;
          controller.inView = function(card) {
            card.visible = true;
          };

          $scope.$emit('animate.enter');
        }.bind(this);

          $scope.setHeaderDisplay(false); 
          //console.log($scope.headerDisplay);

        publications.getAll().then(onLoad);
      });
    }
  ]);

  module.controller('PublicationsItemController', [

    '$scope',
    '$stateParams',
    'publicationsResolverFactory',

    function($scope, $stateParams, publications) {
      var controller = this;
      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        var onLoad = function(data) {
          controller.publications = data;
          $scope.setBreadcrumbs([
            { 'title': 'PUBLICATIONS', 'ref': 'pages-publications', 'color': 'studios' },
            { 'title': controller.publications.title }
          ]);

            $scope.setHeaderDisplay(false); 
            console.log($scope.headerDisplay);

          $scope.$emit('animate.enter');
        }.bind(this);

        publications.get($stateParams.article).then(onLoad);
      });
    }
  ]);
})();

(function () {
  'use strict';

  var module = angular.module('dada.publications');
  
  module.factory('publicationsResolverFactory', ['$http', 'publicationsFactory', function($http, Publications) {
    function format(item) {
      var model = new Publications();
      model.populate('publications', item);
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
        return $http({method: 'GET', cache: true, url: 'http://www.appdemo.co.in/atelier/content/0.1/get-contents?type=c'})
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