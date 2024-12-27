
(function() {
  'use strict';

  angular.module("app", []);

  var service = angular.module('models.model', []).service;


  service('modelFactory', function() {
    /**
      * Converts a underscore separated instance property `such_as_this` into a custom getter method name
      * `getSuchAsThis`.
      *
      * @param {string} name
      *
      * @returns {string}
      */
    function getPropertyNameFromPropertyName(name) {
      // normalize the string
      name = name.toLowerCase();

      name = name[0].toUpperCase() + name.replace(/_([a-z])/g, function(a, b) {
        return b.toUpperCase();
      }).slice(1);

      // return the potential method name
      return name;
    }

    /**
      * Looks for a given property getter and uses that to return a value of the object instance (instance context is set
      * by the model constructor). If none are found then fallback to catch-all getter.
      *
      * @param name
      *
      * @returns {*}
      */
    function getProperty(name) {
      var potentialCustomGetter = 'get' + getPropertyNameFromPropertyName(name);
      /* jshint validthis: true */
      var properties = this;

      if (typeof properties[potentialCustomGetter] === 'function') {
        return properties[potentialCustomGetter]();
      }

      return properties.data['_' + name];
    }

    /**
      * Looks for a given property setter and uses that to set a value of the object instance
      *
      * @param name
      * @param value
      *
      * @returns {void}
      */
    function setProperty(name, value) {
      var potentialCustomSetter = 'set' + getPropertyNameFromPropertyName(name);
      /* jshint validthis: true */
      var properties = this;

      if (typeof properties[potentialCustomSetter] === 'function') {
        properties[potentialCustomSetter](value);
      }

      properties.data['_' + name] = value;
    }

    /**
      * @constructor
      */
    function Model() {
    }

    /**
      * A boolean to define whether the item is selected.
      *
      * @type {boolean}
      */
    Model.prototype.active = false;

    /**
      * Dynamically creates a typed object with getters from the data provided to its constructor.
      *
      * @param {string} type     The name of the type of object that is associated with this.
      * @param {object} data     An object to set as this models properties.
      *
      * @returns {void}
      */
    Model.prototype.populate = function(type, data) {
      this.type = type;
      this.data = {};

      for (var i in data) {
        if (data.hasOwnProperty(i)) {
          if (this.data.hasOwnProperty(i) === true) {
            throw new Error('Unable to set properties of `' + i + '`. Property name conflicts with an existing method or value in Object.');
          }

          this.define(i, data[i]);
        }
      }

      return this;
    };

    /**
      * Defines a single model property and the relevant getters and setters on the model object.
      *
      * @param {string} name
      * @param {*}      value
      *
      * @returns {void}
      */
    Model.prototype.define = function(name, value) {
      var self = this;
      self.data = self.data || {};

      self.data['_' + name] = value;

      Object.defineProperty(self, name, {
        get: function() {
          return getProperty.call(self, name);
        },
        set: function(value) {
          setProperty.call(self, name, value);
        }
      });
    };

    /**
      * Gets an appropriate colour class to use for this item. Used for theming.
      *
      * @returns {string}
      */
    Model.prototype.getTypeClass = function() {
      switch (this.type) {
        case 'work':
          return 'theme-colour-type-work';
        case 'career':
          return 'theme-colour-type-career';
        case 'news':
          return 'theme-colour-type-news';
        case 'publications':
          return 'theme-colour-type-publications';
        case 'studio':
          return 'theme-colour-type-studio';
        case 'think':
          return 'theme-colour-type-think';
        case 'twitter':
          return 'theme-colour-type-twitter';
        default:
          return '';
      }
    };

    /**
      * Splits a string of comma separated tags into an array.
      *
      * @returns {Array}
      */
    Model.prototype.getTags = function() {
      if (this.data && this.data._tags) {
        if (typeof this.data._tags === 'string') {
          return this.data._tags.split(',');
        }

        if (typeof this.data._tags === 'object' && typeof this.data._tags.length === 'number') {
          return this.data._tags;
        }
      }

      return [];
    };

    return Model;
  });
})();
(function () {
  'use strict';





 var service = angular.module('models.collection', []).service;


  service('collectionFactory', function () {

    /**
     * @constructor
     */
    function Collection() {angular.module('app', [])
      this._data = [];
    }

    /**
     * Private property to hold data for this collection.
     *
     * @type {Array}
     *
     * @private
     */
    Collection.prototype._data = [];

    /**
     * Push another item into the data array.
     *
     * @param item
     *
     * @returns {void}
     */
    Collection.prototype.push = function (item) {
      this._data.push(item);
    };

    /**
     * Populate the data all at once.
     *
     * @param data
     */
    Collection.prototype.populate = function (data) {
      this._data = data;
    };

    /**
     * Return all of the data.
     *
     * @returns {Array}
     */
    Collection.prototype.all = function () {
      return this._data;
    };

    /**
     * Returns all of the data in the collection but split into chunks.
     *
     * @param items
     *
     * @returns {Array}
     */
    Collection.prototype.paginate = function (items) {
      var formatted = [];

      var pushToFormatted = function (container) {
        if (container.length) {
          formatted.push(container);
        }
      };

      var container = [];
      for (var i = 0; i < this._data.length; i++) {
        if (i % items === 0) {
          pushToFormatted(container);
          container = [];
        }

        container.push(this._data[i]);
      }

      pushToFormatted(container);

      return formatted;
    };

    Collection.prototype.templatize = function (patterns, templateDirectory) {
      var currentPattern = 0;

      var newContainer = function() {
        // moving on to the next iteration
        return {
          templateDirectory: templateDirectory,
          template: patterns[currentPattern].value + '-' + patterns[currentPattern].variation,
          availableSlots: patterns[currentPattern].value,
          data: []
        };
      };

      var templated = this._data.reduce(function(prev, current) {
        if (prev[prev.length - 1] == undefined) {
          prev.push(newContainer());
        }

        // check to see if we need to move to the next pattern
        if (prev[prev.length - 1].data.length == patterns[currentPattern].value) {
          currentPattern++;

          // make sure index doesn't overflow
          if (patterns[currentPattern] == undefined) {
            currentPattern = 0;
          }

          prev.push(newContainer());
        }

        // insert new record into current iteration
        prev[prev.length - 1].data.push(current);

        return prev;
      }, []);

      var lastTemplateData = templated[templated.length - 1].data;
      if (lastTemplateData.length < templated[templated.length - 1].availableSlots) {
        var newTemplate = patterns.find(function(item) {
          return lastTemplateData.length == item.value;
        });

        templated[templated.length - 1].template = newTemplate.value + '-' + newTemplate.variation;
        templated[templated.length - 1].availableSlots = newTemplate.value;
      }

      return templated;
    };

    return Collection;

  });
})();

(function() {
    'use strict';

    var factory = angular.module('models.custom.hero', ['models.model']).factory;

    factory('heroFactory', ['$state', 'modelFactory', function($state, modelFactory) {
        function Hero() {
        }

        Hero.prototype = Object.create(modelFactory.prototype);

        return Hero;
    }]);
})();
(function () {
  'use strict';

  var factory = angular.module('models.custom.news', ['models.model', 'slugifier']).factory;

  factory('newsFactory', ['$state','$stateParams','$window' ,'modelFactory', 'Slug', function ($state, $stateParams,$window,modelFactory, Slug) {
    function News() {
    }

    console.log('news factory');
    News.prototype = Object.create(modelFactory.prototype);

    News.prototype.go = function ()
    {
     // console.log(this['link']);
      if(this['link']!='')
      {
        $window.open(this['link'], '_blank');
  
      }
      else
      {
          $state.go('pages-news-show', { article: this['title-slug'] ,lang:$stateParams.lang});
      }
    
    };


    News.prototype.getDate = function () {
      return parseInt(parseInt(this.data._date) * 1000);
    };

    Object.defineProperty(News.prototype, 'title-slug', {
      get: function () {
        return Slug.slugify(typeof this.linkResource === 'string' ? this.linkResource : this.title);
      }
    });

    Object.defineProperty(News.prototype, 'permalink', 
    {
      
      get: function () 
      {
       // consoloe.log('permalink');
          return $state.href($state.current.name, $state.params, { absolute: true });
      }
    });

    News.prototype.renderedImage = null;

    return News;
  }]);
})();



(function () {
  'use strict';

  var factory = angular.module('models.custom.publications', ['models.model', 'slugifier']).factory;

  factory('publicationsFactory', ['$state', '$stateParams', 'modelFactory', 'Slug', function ($state,$stateParams ,modelFactory, Slug) {
    function Publications() {
    }

    Publications.prototype = Object.create(modelFactory.prototype);

    Publications.prototype.go = function () {
      $state.go('pages-publications-show', { article: this['title-slug'],lang:$stateParams.lang });
    };

    Publications.prototype.getDate = function () {
      return parseInt(parseInt(this.data._date) * 1000);
    };

    Object.defineProperty(Publications.prototype, 'title-slug', {
      get: function () {
        return Slug.slugify(typeof this.linkResource === 'string' ? this.linkResource : this.title);
      }
    });

    Object.defineProperty(Publications.prototype, 'permalink', {
      get: function () {
        return $state.href($state.current.name, $state.params, { absolute: true });
      }
    });

    Publications.prototype.renderedImage = null;

    return Publications;
  }]);
})();


(function() {
    'use strict';

    var factory = angular.module('models.custom.studio', ['models.model', 'slugifier']).factory;

    factory('studioFactory', ['$state', 'modelFactory', 'inflector', 'Slug', function($state, modelFactory, inflector, Slug) {
        function Studio() {
        }

        Studio.prototype = Object.create(modelFactory.prototype);

        Studio.prototype.go = function() {
            $state.go('pages-studios-show', { location: this['location-slug'] });
        };

        Object.defineProperty(Studio.prototype, 'clean-phone', {
            get: function() {
                return this.telephone.replace(/[^a-z0-9]/gi, '');
            }
        });

        Object.defineProperty(Studio.prototype, 'location-slug', {
            get: function() {
                return Slug.slugify(typeof this.location === 'string' ? this.location : this.title);
            }
        });

        Object.defineProperty(Studio.prototype, 'permalink', {
            get: function() {
                return $state.href($state.current.name, $state.params, {absolute: true});
            }
        });

        return Studio;
    }]);
})();
(function() {
  'use strict';

  var factory = angular.module('models.custom.think', ['models.model', 'slugifier']).factory;

  factory('thinkFactory', ['$state', 'modelFactory', 'Slug', function($state, modelFactory, Slug) {

    function Think() {
      this.modifiedContent = null;
    }

    Think.prototype = Object.create(modelFactory.prototype);

    Think.prototype.go = function() {
      $state.go('pages-think-show', { id: this['title-slug'] });
    };

    Think.prototype.getContent = function() {
      // prevent this function from running twice
      if (this.modifiedContent) {
        return this.modifiedContent;
      }

      var PLAYER_URL = '//player.vimeo.com/video/';
      var PLAYER_QUERY_STRING = '?title=0&amp;byline=0&amp;portrait=0&amp;badge=0';

      this.modifiedContent = this.data._content.map(function(content) {
        if (content.data.Video) {
          content.data.Video = PLAYER_URL + content.data.Video + PLAYER_QUERY_STRING;
        }

        return content;
      });

      return this.modifiedContent;
    };

    Object.defineProperty(Think.prototype, 'title-slug', {
      get: function() {
        return Slug.slugify(typeof this.linkResource === 'string' ? this.linkResource : this.title);
      }
    });

    Object.defineProperty(Think.prototype, 'permalink', {
      get: function() {
        return $state.href($state.current.name, $state.params, {absolute: true});
      }
    });

    return Think;
  }]);
})();
(function() {
    'use strict';

    var factory = angular.module('models.custom.work', ['models.model', 'slugifier']).factory;

    factory('workFactory', ['$state', 'modelFactory', 'Slug','$stateParams', function($state, modelFactory, Slug,$stateParams) {
        function Work() {
        }

        Work.prototype = Object.create(modelFactory.prototype);

        Work.prototype.go = function() {
            $state.go('pages-work-show', { id: this['title-slug'],lang:$stateParams.lang });
        };

        Work.getTitle = function() {
            return (typeof this.data._title === 'undefined') ? this.data._client : this.data._title;
        };

        Object.defineProperty(Work.prototype, 'title-slug', {
            get: function() {
                return Slug.slugify(typeof this.linkResource === 'string' ? this.linkResource : this.client);
            }
        });

        Object.defineProperty(Work.prototype, 'permalink', {
            get: function() {
                return $state.href($state.current.name, $state.params, {absolute: true});
            }
        });

        return Work;
    }]);
})();

(function() {
    'use strict';

    var factory = angular.module('models.custom.career', ['models.model']).factory;

    factory('careerFactory', ['$state', 'modelFactory', function($state, modelFactory) {
        function Career() {
        }

        Career.prototype = Object.create(modelFactory.prototype);

        Career.prototype.go = function() {
            $state.go('pages-career-show', { category: this.slug });
        };

        return Career;
    }]);
})();
angular.module('models.custom.grid', ['models.model']).factory('gridFactory', ['$state', 'modelFactory', function($state, modelFactory) {
    'use strict';

    function Grid() {
    }

    Grid.prototype = Object.create(modelFactory.prototype);

    return Grid;
}]);

(function() {
    'use strict';

    var factory = angular.module('models.custom.twitter', ['models.model', 'cergis.services.ify']).factory;

    factory('twitterFactory', ['$state', 'modelFactory', 'ify', function($state, modelFactory, ify) {
        function Twitter() {
        }

        Twitter.prototype = Object.create(modelFactory.prototype);

        Twitter.prototype.getCreatedAt = function() {
            var date = new Date(Date.parse(this.data._created_at));
            return moment(date).format('MMM Do YYYY');
        };

        Twitter.prototype.getText = function() {
            return ify.clean(this.data._text);
        };

        return Twitter;
    }]);
})();
(function() {
    'use strict';

    var factory = angular.module('models.custom.instagram', ['models.model']).factory;

    factory('instagramFactory', ['$state', 'modelFactory', function($state, modelFactory) {
        function Instagram() {
        }

        Instagram.prototype = Object.create(modelFactory.prototype);

        Instagram.prototype.getCreatedAt = function() {
            var date = new Date(Date.parse(this.data._created_at));
            return moment(date).format('MMM Do YYYY');
        };

        return Instagram;
    }]);
})();
(function() {
    'use strict';

    angular.module('models.custom.search', ['models.model']).factory('searchFactory', SearchFactory);

    SearchFactory.$inject = ['$state', '$rootScope', 'modelFactory'];
    function SearchFactory($state, $rootScope, modelFactory) {
        function Search() {
        }

        Search.prototype = Object.create(modelFactory.prototype);

        Search.prototype.go = function () {
            this.model.go();
            $rootScope.$broadcast('pager.disable');
        };

        Search.getType = function () {
            return this.model.type;
        };

        Object.defineProperty(Search.prototype, 'title', {
            get: function () {
                switch (this.model.type) {
                    case 'work':
                        return this.model.title;
                    default:
                        return this.model.title;
                }
            }
        });

        Object.defineProperty(Search.prototype, 'subtitle', {
            get: function () {
                switch (this.model.type) {
                    case 'work':
                        return this.model.teaser;
                    case 'news':
                        return null;
                    case 'career':
                        return this.model.category;
                    default:
                        return this.model.title;
                }
            }
        });

        Object.defineProperty(Search.prototype, 'image', {
            get: function () {
                switch (this.model.type) {
                    case 'career':
                        return this.model.image;
                    default:
                        return this.model.background;
                }
            }
        });

        Object.defineProperty(Search.prototype, 'studio', {
            get: function () {
                switch (this.model.type) {
                    case 'think':
                    case 'studios':
                        return null;
                    default:
                        return this.model.location;
                }
            }
        });

        Object.defineProperty(Search.prototype, 'base-type', {
            get: function () {
                switch (this.model.type) {
                    case 'studio':
                        return 'studios';
                    default:
                        return this.model.type;
                }
            }
        });

        Object.defineProperty(Search.prototype, 'derivative', {
            get: function () {
                switch (this.model.type) {
                    case 'work':
                        return 'Work';
                    case 'think':
                        return this.model.categories;
                    case 'news':
                        return 'News';
                    case 'publications':
                        return 'Publications';
                    case 'studio':
                        return 'Studios';
                    case 'career':
                        return 'Careers';
                    default:
                        return this.model.location;
                }
            }
        });

        Object.defineProperty(Search.prototype, 'tags', {
            get: function () {
                return this.model.tags;
            }
        });

        Object.defineProperty(Search.prototype, 'search-expertise', {
            get: function () {
                return this.model['search-expertise'];
            }
        });

        Object.defineProperty(Search.prototype, 'search-industries', {
            get: function () {
                return this.model['search-industries'];
            }
        });

        Object.defineProperty(Search.prototype, 'search-studios', {
            get: function () {
                return this.model['search-studios'];
            }
        });

        Object.defineProperty(Search.prototype, 'search-tags', {
            get: function () {
                return this.model['search-tags'];
            }
        });

        return Search;
    }
})();
(function() {
    'use strict';

    var factory = angular.module('models.custom.about', ['models.model']).factory;

    factory('aboutFactory', ['$state', 'modelFactory', function($state, modelFactory) {
        function About() {
        }

        About.prototype = Object.create(modelFactory.prototype);

        Object.defineProperty(About.prototype, 'permalink', {
            get: function() {
                return $state.href($state.current.name, $state.params, {absolute: true});
            }
        });

        return About;
    }]);
})();
(function () {
  'use strict';

  var factory = angular.module('models.collection.work', ['models.collection']).factory;

  factory('workCollectionFactory', ['$state', 'collectionFactory', function ($state, collectionFactory) {
    function WorkCollection() {
    }

    WorkCollection.prototype = Object.create(collectionFactory.prototype);

    var parentPaginator = WorkCollection.prototype.paginate;
    var parentTemplatizer = WorkCollection.prototype.templatize;

    WorkCollection.prototype.templatize = function () {
      var patterns = [
        {value: 1, variation: 'container'},



      ];

      return parentTemplatizer.call(this, patterns, 'pages/work/content-templates/');
    }

    WorkCollection.prototype.paginate = function (items, reverse) {
      var paginated = parentPaginator.call(this, items);

      var formatted = [];

      for (var i = 0; i < paginated.length; i++) {
        var data = [];

        for (var j = 0; j < paginated[i].length; j++) {
          data.push(paginated[i][j]);
        }

        var templateName = reverse ? paginated[i].length + '-container-reverse' : paginated[i].length + '-container';

        formatted.push({
          templateDirectory: 'pages/work/content-templates/',
          template: templateName,
          data: data
        });
      }

      return formatted;
    };

    return WorkCollection;
  }]);
})();

(function () {
  'use strict';

  var factory = angular.module('models.collection.studio', ['models.collection']).factory;

  factory('studioCollectionFactory', ['$state', 'collectionFactory', function ($state, collectionFactory) {
    function StudioCollection() {
    }

    StudioCollection.prototype = Object.create(collectionFactory.prototype);

    var parentPaginator = StudioCollection.prototype.paginate;

    StudioCollection.prototype.paginate = function (items) {
      var paginated = parentPaginator.call(this, items);

      var formatted = [];

      for (var i = 0; i < paginated.length; i++) {
        var data = [];

        for (var j = 0; j < paginated[i].length; j++) {
          data.push(paginated[i][j]);
        }

        formatted.push({
          templateDirectory: 'pages/studios/content-templates/',
          template: 'container',
          data: data
        });
      }

      return formatted;
    };

    return StudioCollection;
  }]);
})();
(function () {
  'use strict';

  var factory = angular.module('models.collection.think', ['models.collection']).factory;

  factory('thinkCollectionFactory', ['$state', 'collectionFactory', function ($state, collectionFactory) {
    function ThinkCollection() {
    }

    ThinkCollection.prototype = Object.create(collectionFactory.prototype);

    var parentTemplatizer = ThinkCollection.prototype.templatize;

    ThinkCollection.prototype.templatize = function () {
      var patterns = [
        {value: 1, variation: 'container'},
        {value: 2, variation: 'container'},
        {value: 3, variation: 'container'},
        {value: 4, variation: 'container'}
      ];

      return parentTemplatizer.call(this, patterns, 'pages/think/content-templates/');
    }

    ThinkCollection.prototype.getCategories = function() {
      return this._data.reduce(function(prev, current) {
        if (prev.indexOf(current.categories) == -1) {
          prev.push(current.categories);
        }

        return prev;
      }, []);
    };

    return ThinkCollection;
  }]);
})();
(function() {
  var module = angular.module('dada.components.related-links', []);

  module.directive('relatedLinks', [

   'thinkResolverFactory',

    function(think) {
      return {
        restrict: 'E',
        scope: {
          item: '='
        },
        templateUrl: 'assets/frontend/js/modules/components/related-links/related-links.html',
        link: function(scope) {
          think.getAll()
            .then(function(data) {
              var formatted = _.chain(data.all())
                .shuffle()
                .chunk(2)
                .value();

              scope.related = [];

              scope.loaded = 0

              scope.hideLoadMore = false;

              scope.loadMore = function() {
                if (formatted[scope.loaded]) {
                  scope.related.push(formatted[scope.loaded]);
                  scope.loaded++;

                  if(scope.loaded == formatted.length) {
                    scope.hideLoadMore = true;
                  }
                }
              }


              scope.loadMore();
              scope.loadMore();
            });
        }
      }
    }
  ]);
})();

(function() {
    'use strict';

    var controller = angular.module('main.controller', []).controller;

    controller('MainController', ['$scope','$rootScope', '$state', '$timeout', '$http', 'studiosResolverFactory','$location','$stateParams','$window','$document', function($scope, $rootScope, $state, $timeout, $http, studios,$location,$stateParams,$window,$document) {
        $scope.studios = null;

        $scope.headerDisplay = false;

        $rootScope.magToggle = false;

        $rootScope.controlsActive = false;

        $rootScope.menuActive = false;

        $rootScope.showLoader = false;

      //  $scope.breadcrumbs = [];
     // $scope.setBreadcrumbs([]);

        //scope.showPreviewCheckbox = false;

        $rootScope.url = $location.path();

        if($rootScope.url == '/') {
            $rootScope.url = $location.path('/en');
        }

        $window.document.title = "Atelier dada - Lighting Architects";

        $rootScope.pagerContent = false;
        $rootScope.pagerContentMobile = false;

        $scope.colors = {
            work:    '#0D0D0D',   //5%
            career:   '#1A1A1A',   //10%
            news:  '#262626',   //15%
            studios:    '#333333',   //20%
            contact: '#404040',   //25%
          //  contact: '#767676'
        };

          $scope.colors2 = {
            work:    '#F2F2F2',  //95%
            career:   '#E5E5E5',  //90%
            news:     '#DCDCDC',  //85%
            studios:    '#CCCCCC',  //80%
            contact: '#BFBFBF',  //75%
         //   contact: '#767676'
        };


        studios.getAll().then(function(data) {
            $scope.studios = data.all();
        });

        /*
        $http.get('backend/login_status')
            .then(function(data)
            {
                $scope.showPreviewCheckbox = Boolean(parseInt(data.data));
            });

        */

         $scope.setSubCat = function(value)
         {
           var val = value.toLowerCase();
           // val.toLowerCase();
           var new_val = val.split(",");


            $scope.sub_cat = new_val[0];
             $scope.sub_cat1 = new_val[1];
              $scope.sub_cat2 = new_val[2];
           // console.log($scope.sub_cat);
           ///   console.log($scope.sub_cat1);
             //   console.log($scope.sub_cat2);


        };

        $scope.showPreviewCheckbox=0;


        $scope.preview = Cookies.get('preview') === '1';

        $scope.previewMode = function() {
            var current = Cookies.get('preview');

            if (current === '1') {
                Cookies.set('preview', '0');
            } else {
                Cookies.set('preview', '1');
            }
        };

        $scope.setBreadcrumbs = function(value) {
            $scope.breadcrumbs = value;
        };

        $scope.setHeaderDisplay = function(value) {
            $scope.headerDisplay = value;
        };

         $scope.setPagetitle = function(value)
         {
            $window.document.title = value + " | Atelier dada";
        };


        $scope.$on('pager.enable', function(params, mobile) {
            if (mobile === true) {
                $rootScope.pagerContentMobile = true;
            }

            $rootScope.pagerContent = true;
        });

        $scope.$on('pager.disable', function() {
            $rootScope.pagerContent = $rootScope.pagerContentMobile = false;
        });

        $scope.$watch('pagerContent', function(value) {
            if (value) {
                $('html').addClass('no-bounce');
            } else {
                $('html').removeClass('no-bounce');
            }
        });

        $scope.$on('loader.show', function() {
            $rootScope.showLoader = true;
        });

        $scope.$on('loader.hide', function() {
            $rootScope.showLoader = false;
        });

        $scope.blockInteraction = false;
        $scope.$on('$stateChangeStart', function() {
            $scope.blockInteraction = true;
        });

        $scope.$on('animate.complete', function() {
            $scope.blockInteraction = false;
        });

        $scope.controlsVisible = false;
        $scope.$on('animate.ready', function() {
            $scope.controlsVisible = true;
        });

        var menuState, menuStateParams;
        $scope.toggleMenu = function() {
            if ($scope.blockInteraction) {
                return;
            }

            if ($rootScope.menuActive) {
                if (menuState) {
                    $state.go(menuState, menuStateParams || {});
                } else {
                    $state.go('pages-home');
                }
            } else {
                menuState = $state.current.name;
                menuStateParams = $state.params;

//$state.go('controls-navigation');
                $state.go("controls-navigation", {"lang": $stateParams.lang});
            }
        };

        var searchState, searchStateParams;
        $scope.toggleSearch = function() {
            if ($scope.blockInteraction) {
                return;
            }

            if ($rootScope.magToggle) {
                console.log(searchState);
                if (searchState) {
                    $state.go(searchState, searchStateParams || {});
                } else {
                    $state.go('pages-home',{"lang": $stateParams.lang});
                }
            } else {
                searchState = $state.current.name;
                searchStateParams = $state.current.name === 'search-results' ? {search: $stateParams.search} : $state.params;
                $state.go('controls-search.details', {"lang": $stateParams.lang});

            }
        };

        $scope.goHome = function()
        {
            if ($scope.blockInteraction)
            {
                return;
            }

            $state.go('pages-home',{lang: $stateParams.lang});
        };
    }]);
})();

(function() {
    'use strict';

    var controller = angular.module('navigation.controller', []).controller;

    controller('NavigationController', ['$scope', '$timeout','$stateParams', function($scope, $timeout,$stateParams) {
        $scope.$on('animate.ready', function() {
            $timeout(function() {
                $scope.$emit('animate.init', 'slide-in-down');

                $scope.language = $stateParams.lang;
               // console.log( $stateParams.lang); //onsole.log($rootScope.language);

           //    $scope.setBreadcrumbs([]);

                // because this controller isn't actually async we need to fake it to make sure the classes get applied correctly
                $timeout(function() {
                    $scope.$emit('animate.enter');
                });

                $scope.links = [
                    {state: 'pages-work-index', 'title': 'Work', background: $scope.colors.work,color:$scope.colors2.work},
                   // {state: 'pages-think-index', 'title': 'Think', background: $scope.colors.think},
                    //{state: 'pages-career-index', 'title': 'Careers', background: $scope.colors.career},
                    {state: 'pages-about-index', 'title': 'About', background: $scope.colors.career, color:$scope.colors2.career},
                    {state: 'pages-news', 'title': 'News', background: $scope.colors.news,color:$scope.colors2.news},
                    {state: 'pages-publications', 'title': 'Media', background: $scope.colors.studios,color:$scope.colors2.studios},

                    {state: 'pages-contact', 'title': 'Contact', background: $scope.colors.contact,color:$scope.colors2.contact}
                ];

                $scope.style = {
                    background: $scope.links[0].background
                };

                 $scope.fcolor = {
                    color: $scope.links[0].color
                };

//updatefColor
                $scope.custom = false;
                $scope.toggleCustom = function() {
                    $scope.custom = $scope.custom === false ? true: false;
                };




                  $scope.updatefColor = function(color) 
                  {
                    $scope.fcolor = 
                    {
                     //   color: color
                    };
                };

                  $scope.resetcolor = function() 
                  {
                  console.log('mouseleave');
                     $scope.style = 
                    {
                        background: "#000"
                        
                    };
                };
                   $scope.updateColor = function(color) 
                   {
                    $scope.style = 
                    {
                        background: color
                        
                    };
                };
            }, 1000);
        });
    }]);
})();

(function() {
  var module = angular.module('dada.home', [
    'ui.router',
    'models.custom.hero',
    'models.custom.news',
     'models.custom.publications',
    'models.custom.studio',
    'models.custom.think',
    'models.custom.work',
    'models.custom.career',
    'models.custom.grid',
    'models.custom.twitter',
   // 'hm.readmore'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-home', {
        url: '/:lang',
        templateUrl: 'assets/frontend/partials/pages/home/index.html',
        controller: 'HomeController',
        sources: ['studios', 'index']
      })
  }]);
})();
(function () {
  'use strict';

  var factory = angular.module('dada.home').factory;

  var homeResolverFactory = function ($http, $stateParams, Hero, News, Studio, Think, Work, Career, Grid, Twitter, Publications)
  {

    var url  = "backend/api/index.json";

   //   console.log($stateParams.lang);

if($stateParams.lang=='fr')
{
  url = "backend/api/index-fr.json";
}


    var createNewModelObjectOfType = function (data) {
      var model;

      switch (data.type) {
        case null:
          model = new Hero();
          break;
        case 'work':
          model = new Work();
          break;
        case 'think':
          model = new Think();
          break;
        case 'career':
          model = new Career();
          break;
        case 'news':
          model = new News();
          break;
        case 'publications':
          model = new Publications();
          break;
        case 'studio':
          model = new Studio();
          break;
        case 'grid':
          model = new Grid();
          break;
        case 'twitter':
          model = new Twitter();
          break;
        default:
          throw new Error('Missing handler for data of type `' + data.type + '`');
      }

      model.populate(data.type, data.data);
      return model;
    };

    return {
      getAll: function (tweet)
      {

        return $http({method: 'GET', url: url})
          .then(function (result) {
            result.data.sort(function (a, b) {
              if (a.order < b.order) {
                return -1;
              }

              if (a.order > b.order) {
                return 1;
              }

              return 0;
            });

            // make jshint happy
            var i;

            var formatted = [];
            var shuffle = [];
            var position = [];

            for (i = 0; i < result.data.length; i++) {
              if (result.data[i].type !== 'grid')
              {
                console.log(result.data[i]);
                formatted.push(createNewModelObjectOfType(result.data[i]));
              } else {
                var grid = createNewModelObjectOfType(result.data[i]);

                for (var j in grid.data) {
                  if (grid.data.hasOwnProperty(j) && j !== '_template') {
                    if (grid.data[j].type === 'twitter') {
                      grid.data[j].data = tweet.data[0];
                    }

                    var propertyName = j.replace(/^_/, '');
                    grid[propertyName] = createNewModelObjectOfType(grid.data[j]);
                  }
                }

                formatted.push(grid);
              }

/*if (result.data[i].type === null)
              {
                shuffle.push(createNewModelObjectOfType(result.data[i]));
                position.push(i);
              }  */

            }

          //  shuffling(position);
            for (i = 0; i < shuffle.length; i++) {
              formatted.splice(position[i], 1, shuffle[i]);
            }

            return formatted;
          });
      },

      getTweet: function () {
        return $http({method: 'GET', url: 'backend/social/twitter'});
      }
    };
  };

  function shuffling(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

  factory('homeResolverFactory', [
    '$http',
    '$stateParams',
    'heroFactory',
    'newsFactory',
    'studioFactory',
    'thinkFactory',
    'workFactory',
    'careerFactory',
    'gridFactory',
    'twitterFactory',
    'publicationsFactory',
    homeResolverFactory
  ]);
})();

(function () {
  'use strict';

  angular.module('dada.home').controller('HomeController', [

    '$scope', '$timeout', 'homeResolverFactory', '$stateParams',

    function($scope, $timeout, home,$stateParams)
    {

          //   console.log($stateParams.lang);
      $timeout(function () {
        $scope.$emit('animate.init');
      });

      home.getTweet()
        .then(function (data)
        {
          return home.getAll(data);
        })
        .then(function (data)
        {
          $scope.home = data;
          $scope.setBreadcrumbs([]);
          $scope.setHeaderDisplay(false);
          $scope.language = $stateParams.lang;
         // console.log( $scope.language);
             // $routeParams.orderId

        });
    }

  ]);
})();

(function () {
  'use strict';

  var module = angular.module('dada.home');

  module.directive('homeArticle', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        item: '='
      },
      template: '<div ng-include="getTemplateUrl()" include-replace></div>',
      link: function (scope) {
        var $containerScope = $('.homeScroller');
        $rootScope.itemsLoaded++;

        scope.getTemplateUrl = function ()
        {
       //  console.log("inside scroller");
//$(".page-selected").removeClass("page-selected");
          var template = scope.item.template || 'article';
          return 'assets/frontend/partials/pages/home/directives/' + template + '.html';
        };
      }
    };
  }]);
})();

(function() {
  var module = angular.module('dada.work', [
    'models.custom.work',
    'models.collection.work'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-work-index', {
        url: '/:lang/work',
        params: {
                  lang: 'en',
                },
        templateUrl: 'assets/frontend/partials/pages/work/index.html',
        controller: 'WorkController',
        sources: ['studios', 'work']
      })

      .state('pages-work-show', {
        url: '/:lang/work/:id',
        templateUrl: 'assets/frontend/partials/pages/work/show.html',
        controller: 'WorkItemController',
        sources: ['studios', 'work']
      })

        .state('pages-work-category', {
        url: '/:lang/work/category/:id',
        templateUrl: 'assets/frontend/partials/pages/work/category.html',
        controller: 'WorkCategoryController as nc',
        sources: ['studios', 'work']
      })
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.work');

  module.factory('workResolverFactory', workResolverFactory);

  workResolverFactory.$inject = ['$http', '$state','$stateParams', 'contentFormatter', 'workFactory', 'workCollectionFactory'];
  function workResolverFactory($http, $state, $stateParams, contentFormatter, Work, WorkCollection) {
    var factoryObj = {};

    Object.defineProperty(factoryObj, 'MAX_ITEMS_PER_PAGE', {
      writable: false,
      configurable: false,
      value: 3
    });

    factoryObj.getAll = function () {
      return $http({method: 'GET', cache: true, url: 'http://www.appdemo.co.in/atelier/content/0.1/get-work?lang='+$stateParams.lang})
        .then(function (result) {
          var formatted = {};

          formatted.overview = result.data.overview;
          formatted.data = new WorkCollection();
          formatted.data.populate([]);

          var data = contentFormatter.format(result.data.data);
          for (var i = 0; i < data.data.length; i++) {
            var model = new Work();
            model.populate('work', data.data[i]);
            formatted.data.push(model);
          }

          return formatted;
        });
    };

    factoryObj.getAllNotHidden = function () {
      return $http({method: 'GET', cache: true, url: 'http://www.appdemo.co.in/atelier/content/0.1/get-work?featured=1&lang='+$stateParams.lang})
        .then(function (result) {
          var formatted = {};

          formatted.overview = result.data.overview;
          formatted.data = new WorkCollection();
          formatted.data.populate([]);

          var data = contentFormatter.format(result.data.data);

          for (var i = 0; i < data.data.length; i++)
          {

            if (data.data[i].hidemenu === false)
            {
              var model = new Work();
              model.populate('work', data.data[i]);
              formatted.data.push(model);
            }

          }

          return formatted;
        });
    };

     factoryObj.getworkcategory = function ($id)
     {
      return $http({method: 'GET', cache: true, url: 'http://www.appdemo.co.in/atelier/content/0.1/get-work?tag='+$id+'&lang='+$stateParams.lang})
        .then(function (result)
        {
          var formatted = {};
        //  console.log($id);
          formatted.overview = result.data.overview;
          formatted.data = new WorkCollection();
          formatted.data.populate([]);

          var data = contentFormatter.format(result.data.data);

          for (var i = 0; i < data.data.length; i++)
          {
            if (data.data[i].hidemenu === false)
            {
              var model = new Work();
              model.populate('work', data.data[i]);
              formatted.data.push(model);
            }

          }

          return formatted;
        });
    };


    factoryObj.getAllByStudio = function (studio) {
      return factoryObj.getAll().then(function (formatted) {
        studio = studio.replace('-', ' ').toLowerCase();

        var result = formatted.data.all().reduce(function(prev, current) 
        {
          console.log();

          var displayWork = current['search-studios'].split(',').find(function(workStudio) 
          {
            return workStudio.toLowerCase() === studio.toLowerCase();
          });

          if (displayWork != undefined) {
            prev.push(current);
          }

          return prev;
        }, []);

        if (result) {
          var collection = new WorkCollection();
          collection.populate(result);

          return {
            data: collection
          };
        }

        $state.go('errors-404');
      });
    };

    factoryObj.get = function (slug) {
      return factoryObj.getAll().then(function (formatted) {
        var data;
        for (var i = 0; i < formatted.data.all().length; i++) {
          if (slug === formatted.data.all()[i]['title-slug']) {
            data = formatted.data.all()[i];
            for (var j = 0; j < data.content.length; j++) {
              if (typeof data.content[j].data.Video !== "undefined")
                data.content[j].data.Video = "//player.vimeo.com/video/" + data.content[j].data.Video + "?title=0&amp;byline=0&amp;portrait=0&amp;badge=0";
            }
            break;
          }
        }

        if (data) {
          return data;
        }

        $state.go('errors-404');
      });
    };

    return factoryObj;
  }
})();

(function () {
  'use strict';

  var module = angular.module('dada.work');

  WorkController.$inject = [
    '$scope',
    'workResolverFactory',
    '$stateParams',
    '$window',
    '$document'


  ];

  module.controller('WorkController', WorkController);

  function WorkController($scope, work,$stateParams,$window,$document) {
    $scope.$on('animate.ready', function () {
      $scope.$emit('animate.init');


      if( $stateParams.lang=='en')
      {
      $scope.setBreadcrumbs([{ 'title': 'WORK', 'ref': 'pages-work-index', 'color': 'work' },{ 'title': 'Categories', 'ref': 'pages-work-index', 'color': 'work','display_menu':'1' }]);
      }
      else
      {
          $scope.setBreadcrumbs([{ 'title': 'Lumières', 'ref': 'pages-work-index', 'color': 'work' },{ 'title': 'Typologie', 'ref': 'pages-work-index', 'color': 'work','display_menu':'1' }]);
      }

        $scope.setHeaderDisplay(false); //console.log($scope.headerDisplay);
        $scope.setPagetitle('Work');

         $scope.setSubCat('');
        $scope.language = $stateParams.lang;
      //  $scope.cat = "Residential";



      work.getAllNotHidden()
        .then(function (data) {
          $scope.workGrid = data.data.templatize();
          $scope.workResponsive = data.data.paginate(1);
          $scope.overview = data.overview;
        });
    });
  }
})();



(function () {
  'use strict';

  var module = angular.module('dada.work');

  WorkCategoryController.$inject = [
    '$scope',
    'workResolverFactory',
    '$stateParams'
  ];

  module.controller('WorkCategoryController', WorkCategoryController);


  function WorkCategoryController($scope, work,$stateParams)
  {

     /// $scope.setBreadcrumbs([]);
      $scope.$on('animate.ready', function () {
      $scope.$emit('animate.init');
      //console.log($stateParams.id);
     // $scope.setBreadcrumbs([{ 'title': 'WORK', 'ref': 'pages-work-category', 'color': 'work' }]);
        //$scope.setBreadcrumbs([{ 'title': 'WORK', 'ref': 'pages-work-category', 'color': 'work' }, { 'title': $stateParams.id, 'color': '','display_menu':'1' }]);

       if($stateParams.lang=='en')
      {
           $scope.setBreadcrumbs([{ 'title': 'WORK', 'ref': 'pages-work-index', 'color': 'work' }, { 'title': "Categories", 'color': '','display_menu':'1' }]);
      }
      else
      {
        //  $scope.setBreadcrumbs([{ 'title': 'Lumières', 'ref': 'pages-work-index', 'color': 'work' },{ 'title': 'Typologie', 'ref': 'pages-work-index', 'color': 'work','display_menu':'1' }]);
            $scope.setBreadcrumbs([{ 'title': 'Lumières', 'ref': 'pages-work-index', 'color': 'work' }, { 'title': "Typologie", 'color': '','display_menu':'1' }]);
     }


        $scope.setHeaderDisplay(false);
        $scope.language = $stateParams.lang;
        $scope.setSubCat($stateParams.id);

        $scope.setPagetitle($stateParams.id);

         work.getworkcategory($stateParams.id)
        .then(function (data)
        {
          $scope.workGrid = data.data.templatize();
          $scope.workResponsive = data.data.paginate(1);
          $scope.overview = data.overview;
         //  $scope.sub_cat = $stateParams.id;
       //    console.log( $scope.sub_cat);

        },
        function myError(response)
        {
      //  console.log("no data exist");
        //$scope.myWelcome = "No data added";
       }

        );
    });
  }
})();


(function () {
  'use strict';

  var module = angular.module('dada.work');

  module.controller('WorkItemController', WorkItemController);


  WorkItemController.$inject = ['$http','$scope', '$state','$timeout', '$stateParams', 'workResolverFactory', 'preloaderService']
  function WorkItemController($http,$scope, $state,$timeout, $stateParams, work, PreloaderService) {
    $scope.$on('animate.ready', function () {
      $scope.$emit('animate.init');

      work.get($stateParams.id)
        .then(function (data) {
          $scope.work = data;

          $scope.language = $stateParams.lang;

          	$scope.limit = 100;
          $scope.lessText = "Know less";
          $scope.moreText = "Know more";
          $scope.dotsClass = "toggle-dots-grey";
          $scope.linkClass = "toggle-link-yellow";
          $scope.contentToggle = true;

      
         //console.log(data);
         

        if( $stateParams.lang=='en' && $state.current.name=='pages-work-show')
        {
             $scope.setSubCat(data['work-tags']);
          $scope.setBreadcrumbs([{ 'title': 'WORK', 'ref': 'pages-work-index({lang:\'en\'})', 'color': 'work' }, { 'title': 'Categories', 'ref': 'pages-work-index', 'color': 'work','display_menu':'1' }, { 'title': $scope.work.title, 'color': '' }]);
        }
        else if( $stateParams.lang=='fr' && $state.current.name=='pages-work-show')
        {
         // "pages-home({lang: 'en'})
          $scope.setSubCat(data['work-tags']);
           $scope.setBreadcrumbs([{ 'title': 'Lumières', 'ref': 'pages-work-index({lang:\'fr\'})', 'color': 'work' }, { 'title': 'Typologie', 'ref': 'pages-work-index', 'color': 'work','display_menu':'1' }, { 'title': $scope.work.title, 'color': '' }]);
        }

        if($stateParams.id=="the-mango-tree-house-facade" || $stateParams.id=="the-mango-tree-house-interior" || $stateParams.id=="the-mango-tree-house-landscape" )
        {
          $scope.testimonial_client = "Mr. Manish Jain";
          $scope.testimonial_studio = "Client";
          $scope.testimonial_client_speech = "The whole project was a big learning experince and a very plesant discovery to the potenital of artificial light. We all are highly impressed with the results.";
          $scope.testimonial_dada_speech = "";

           $scope.testimonial_client2 = "Mr. Ujjaval Panchal";
          $scope.testimonial_studio2 = "Architect, 72by3 Studio";
          $scope.testimonial_client_speech2 = "Apart from their standadrd discreet, glare-free and archietctuarlly well-integrated lighting design, they successfully touched the heart of the project, which is to connect the interiors with the exterior. The results were really stunning.";
          $scope.testimonial_dada_speech2 = "";

           $scope.testimonial_client3 = "Ms. Kinny Soni";
          $scope.testimonial_studio3 = "Interior Architect, KSUP studio";
          $scope.testimonial_client_speech3 = "They are not exquisite professional lighting designers but also a valuable team asset for any challenging project.";
          $scope.testimonial_dada_speech3 = "";

        }
        //dalal-villas and  dalal-villas-product
         if($stateParams.id=="dalal-villas" || $stateParams.id=="dalal-villas-product"  )
        {
          $scope.testimonial_client = "Mr. Rikin Dalal";
          $scope.testimonial_studio = "Client";
          $scope.testimonial_client_speech = "The work done for lighting is just phenomenal. It creates perfect family comfortable atmosphere with the minimal and perfect lighting used. The garden during the night gets enhanced more due to the elegant lighting and thus makes it a beautiful place to sit and get together with family and friends. It adds a value addition to everything what is built and make it look more perfect.";
          $scope.testimonial_dada_speech = "";
        }

        

         if($stateParams.id=="unesco-the-big-hall" )
        {
          $scope.testimonial_client = "Thierry Salah";
          $scope.testimonial_studio = "Art Fair, Exhibitions, Senior Event Development Strategy - Art Advisory Explicit Service";
          $scope.testimonial_client_speech = "Truly dedicated expert, with a great creative perspective, for the purpose of the event's international message. ";
          $scope.testimonial_dada_speech = "";
        }

        if($stateParams.id=="sumel-6" )
        {
          $scope.testimonial_client = "Safal Reality";
          $scope.testimonial_studio = "";
          $scope.testimonial_client_speech = "We appreciate their knowledge of the subject and their professionalism towards the work. We are satisfied with their efforts and then end result of our projects deisgned by them. Their lighting inputs have brought immense value to the projects.";
          $scope.testimonial_dada_speech = "";
        }

           if($stateParams.id=="shivalik-hs" )
        {
          $scope.testimonial_client = "Mr. Taral Shah";
          $scope.testimonial_studio = "Managing Director, Shivalik Projects";
          $scope.testimonial_client_speech = "We at Shivalik projects and our customers are impressed by your work. I would like to thank you and congratulate you for your design senstivity, practicality and professional integrity.";
          $scope.testimonial_dada_speech = "";
        }

       

          if($stateParams.id=="ccbta-terre-d-argence" )
        {
          $scope.testimonial_client = "Jean Sabatier";
          $scope.testimonial_studio = "Ancien president de l' ACE";
          $scope.testimonial_client_speech = "Naissance d'une star! j 'ai mis a 1' epreuve sa sensibilite, son sens artistique et sa perception du besoin des habitants en terme d'identification des espaces, de securite et d'amelioration du cadre de vie ; Mme Bouhlel a exprime avec une remarquable justesse les lignes fortes d'un programme d'amenagement lumiere, parfaitement reconnu par les elus et admis par les services techniques .Ikram Bouhlel un travail d'analyse d'une grande precision, elle a montre avec clarte les tendances, les equilibres, les variations propres a valoriser sans exces un milieu urbain de nature aussi differenciee, a la grande satisfaction de tous les acteurs.";
          $scope.testimonial_dada_speech = "";
        }

          $scope.setHeaderDisplay(false);
          $scope.setPagetitle($scope.work.title);

          var preloader = new PreloaderService();
          return preloader.preloadAll(data);
        })
        .then(function () {
          return work.getAll().then(function (formatted) {
            var results = [];

            var ids = {};
            var data = formatted.data.all();


            while (results.length < 2) {
              var selection = data[Math.floor(Math.random() * data.length)];
              if (selection['title-slug'] !== $stateParams.id && ids[selection.id] !== null) {
                ids[selection.id] = null;
                results.push(selection);
              }
            }

            return results;
          });
        })
        .then(function (data)
        {

           $http.get("http://www.appdemo.co.in/atelier/content/0.1/get-related-work?slug="+$stateParams.id).then( function(response)
          {
            $scope.related = {};
            $scope.related.template = '2-column-related-item';
            $scope.related.data = response.data;  console.log($scope.related.data);

            if(response.data.status=false)
            {
             $scope.related.data =  '';
            }
          // console.log(response.data);
            $scope.$emit('animate.enter', true);

          });
          /*
          $scope.related = {};
          $scope.related.template = '2-column-related-item';
          $scope.related.data = data;  //console.log($scope.related);
          console.log(data);
          $scope.$emit('animate.enter', true);
     */


        });
    });
  }
})();
(function() {
  var module = angular.module('dada.about', [
    'ui.router',
    'models.custom.about'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-about-index', {
        url: '/:lang/about',
        templateUrl: 'assets/frontend/partials/pages/about.html',
        controller: 'AboutController',
        sources: ['studios', 'about-us']
      });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.about');

  module.controller('AboutController', ['$scope', '$timeout', '$stateParams', 'aboutResolverFactory', 'preloaderService', function ($scope, $timeout, $stateParams, about, PreloaderService) {
    $scope.$on('animate.ready', function () {
      $scope.$emit('animate.init');

      if($stateParams.lang=='en')
      {
      $scope.setBreadcrumbs([{ 'title': 'ABOUT' }]);
      }
      else{
           $scope.setBreadcrumbs([{ 'title': 'ATELIER' }]);
      }


        $scope.setHeaderDisplay(false);
           $scope.setPagetitle("About Us");
           $scope.language = $stateParams.lang;
        // console.log($scope.headerDisplay);

      about.getContent().then(function (response) {
        $scope.about = response;
        $scope.$emit('animate.enter', true);
      });
    });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.about');

  module.factory('aboutResolverFactory', ['$http', '$state', '$stateParams','contentFormatter', 'aboutFactory', function ($http, $state, $stateParams, contentFormatter, About) {
    var factoryObj = {};

    factoryObj.getContent = function ()
    {
       var url  = "backend/api/about-us.json";

   //   console.log($stateParams.lang);
      if($stateParams.lang=='fr')
      {
        url = "backend/api/about-us-fr.json";
      }

      return $http({method: 'GET', cache: true, url: url})
        .then(function (response) {
          var data = response.data;
          data.permalink = $state.href($state.current.name, $state.params, { absolute: true });
          return data;
        });
    };

    return factoryObj;
  }]);
})();

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
    '$state',
    '$stateParams',
    '$scope',
    'newsResolverFactory',

    function($state,$stateParams,$scope, news)
    {


      var controller = this;
       $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        if($stateParams.lang=='en')
        {
            $scope.setBreadcrumbs([{ 'title': 'NEWS', 'ref': 'pages-news', 'color': 'news' }]);
        }
        else
        {
               $scope.setBreadcrumbs([{ 'title': 'ACTUALITÉS', 'ref': 'pages-news', 'color': 'news' }]);
        }
      

        $scope.language = $stateParams.lang;
           $scope.setPagetitle("News");
          //console.log('Header Display:' + $scope.headerDisplay);

        var onLoad = function(data) {
          controller.news = data;
          controller.inView = function(card) {
            card.visible = true;
          };

          $scope.$emit('animate.enter');
        }.bind(this);

          $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);
       //   console.log('news');
          news.getAll().then(onLoad);
         //  $stateParams.article  = null;
      });
    }
  ]);

  module.controller('NewsItemController', [

    '$scope',

    '$state',
    '$stateParams',
    'newsResolverFactory',

    function($scope, $state,$stateParams, news)
    {
      var controller = this;
       $scope.language = $stateParams.lang;
      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        var onLoad = function(data) {
          controller.news = data;

          console.log($state.current.name);
    if($stateParams.lang=='en' && $state.current.name=='pages-news-show'  )
    {
              $scope.setBreadcrumbs([
            { 'title': 'NEWS', 'ref': 'pages-news({lang:\'en\'})', 'color': 'news' },
            { 'title': controller.news.title }
          ]);
    } else if($stateParams.lang=='fr' && $state.current.name=='pages-news-show' )
    {

        $scope.setBreadcrumbs([
            { 'title': 'Actualités', 'ref': 'pages-news({lang:\'fr\'})', 'color': 'news' },
            { 'title': controller.news.title }
          ]);
    }



            $scope.setHeaderDisplay(false);
              $scope.setPagetitle(controller.news.title);
            //console.log($scope.headerDisplay);
//console.log('newsitem');
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

  module.factory('newsResolverFactory', ['$http', '$stateParams', 'newsFactory', function($http, $stateParams, News) {
    function format(item)
    {
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
      getAll: function ()
      {
        return $http({method: 'GET', cache: true, url: 'http://www.appdemo.co.in/atelier/content/0.1/get-contents?type=n&lang='+$stateParams.lang})
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



//publications
(function() {
  var module = angular.module('dada.publications', []);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-publications', {
        url: '/:lang/media',
        templateUrl: 'assets/frontend/partials/pages/publications/index.html',
        controller: 'PublicationsController as pc',
        params: {
          id: { value: null }
        },
        sources: ['publications']
      })

      .state('pages-publications-show', {
        url: '/:lang/media/:article',
        templateUrl: 'assets/frontend/partials/pages/publications/show.html',
        controller: 'PublicationsItemController as pc',
        sources: ['publications']
      });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.publications');

  module.controller('PublicationsController', [

    '$scope',
    '$stateParams',
    'publicationsResolverFactory',

    function($scope, $stateParams, publications) {
      var controller = this;
      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

      if($stateParams.lang=='en')
      {
           $scope.setBreadcrumbs([{ 'title': 'MEDIA', 'ref': 'pages-publications', 'color': 'studios' }]);
      }
      else
      {
           $scope.setBreadcrumbs([{ 'title': 'MÉDIA', 'ref': 'pages-publications', 'color': 'studios' }]);
      }
     

  $scope.language = $stateParams.lang;
    $scope.setPagetitle("Media | Publications | Awards");
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
    '$state',
    '$stateParams',
    'publicationsResolverFactory',

    function($scope, $state,$stateParams, publications)
    {
      var controller = this;
        $scope.language = $stateParams.lang;
      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        var onLoad = function(data)
        {
          controller.publications = data;


        //  console.log(controller.publications.title);
        if($stateParams.lang=='en' && $state.current.name=="pages-publications-show")
        {
          $scope.setBreadcrumbs([
            { 'title': 'MEDIA', 'ref': 'pages-publications({lang:\'en\'})', 'color': 'studios' },
            { 'title': controller.publications.title }
          ]);
        } else if($stateParams.lang=='fr' && $state.current.name=="pages-publications-show")
        {
            $scope.setBreadcrumbs([
            { 'title': 'MÉDIA', 'ref': 'pages-publications({lang:\'fr\'})', 'color': 'studios' },
            { 'title': controller.publications.title }
          ]);

        }
         $scope.language = $stateParams.lang;


            $scope.setHeaderDisplay(false);
            $scope.setPagetitle(controller.publications.title);
            //console.log($scope.headerDisplay);

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

  module.factory('publicationsResolverFactory', ['$http','$stateParams', 'publicationsFactory', function($http, $stateParams,Publications) {
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
        return $http({method: 'GET', cache: true, url: 'http://www.appdemo.co.in/atelier/content/0.1/get-contents?type=c&lang='+$stateParams.lang})
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




(function() {
  var module = angular.module('dada.think', [
    'ui.router',
    'models.collection.think',
    'models.custom.think'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-think-index', {
        url: '/think',
        templateUrl: 'assets/frontend/partials/pages/think/index.html',
        controller: 'ThinkController as tc',
        sources: ['studios', 'think']
      })
      .state('pages-think-show', {
        url: '/think/{id}',
        templateUrl: 'assets/frontend/partials/pages/think/show.html',
        controller: 'ThinkItemController',
        sources: ['studios', 'think']
      });
  }]);
})();



(function() {
  'use strict';

  var module = angular.module('dada.think');

  module.factory('thinkResolverFactory', ThinkFactory);

  ThinkFactory.$inject = ['$http', '$state', 'thinkFactory', 'thinkCollectionFactory'];
  function ThinkFactory($http, $state, Think, ThinkCollection) {
    var getAll = function(filterFunction) {
      return $http({method: 'GET', cache: true, url: 'backend/api/think.json'})
        .then(function(response) {
          if (filterFunction) {
            response.data.content = response.data.content.filter(filterFunction);
          }

          var mapped = response.data.content.map(function(item) {
            var model = new Think();
            model.populate('think', item);
            return model;
          });

          var result = new ThinkCollection();
          result.populate([]);
          mapped.forEach(function(item) {
            result.push(item);
          });

          return result;
        });
    };

    var get = function(slug) {
      return getAll().then(function(formatted) {
        var selection = formatted.all()
          .find(function(x) {
            return x['title-slug'] == slug;
          });

        if (selection) return selection;

        $state.go('errors-404');
      });
    };

    return {
      get:    get,
      getAll: getAll
    };
  }
})();
(function () {
  'use strict';

  var module = angular.module('dada.think');

  module.controller('ThinkController', [

    '$scope',
    'thinkResolverFactory',

    function($scope, think) {
      var controller = this;

      controller.highlighted = 'All';

      $scope.$on('animate.ready', function () {
        $scope.$emit('animate.init');

        $scope.setBreadcrumbs([{ 'title': 'THINK', 'ref': 'pages-think-index', 'color': 'think' }]);
          $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

        controller.filter = function(category) {
          $scope.$emit('animate.init', 'default-no-scale');

          think.getAll(function(item) {
            if (category == 'All') {
              return true;
            }

            return item.categories == category;
          })
            .then(function (response) {
              $scope.$emit('animate.hide', function() {
                controller.highlighted = category;
                controller.think = response.templatize();
                $scope.$emit('animate.init');
                $scope.$apply();
              });
            });
        };

        think.getAll()
          .then(function (response) {
            controller.think = response.templatize();
            controller.categories = ['All'].concat(response.getCategories());
            $scope.$emit('animate.enter');
          });
      });
    }
  ]);
})();
(function() {
    'use strict';

    var module = angular.module('dada.think');

    ThinkController.$inject = ['$scope', '$stateParams', 'thinkResolverFactory', 'preloaderService'];
    function ThinkController($scope, $stateParams, think, PreloaderService) {
      $scope.$on('animate.ready', function() {
        $scope.$emit('animate.init');

        think.get($stateParams.id)
          .then(function(data) {
            $scope.think = data;

            $scope.setBreadcrumbs([{'title': 'THINK', 'ref': 'pages-think-index', 'color': 'think'}, {'title': $scope.think.title, 'color': ''}]);
                $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

            var preloader = new PreloaderService();
            return preloader.preloadAll(data);
          })
          .then(function() {
            $scope.$emit('animate.enter', true);
          });
      });
    }

    module.controller('ThinkItemController', ThinkController);
})();


(function() {
  var module = angular.module('dada.studios', [
    'ui.router',
    'models.custom.studio',
    'models.collection.studio',
    'models.custom.twitter',
    'models.custom.instagram'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-studios-index', {
        url: '/:lang/studios',
        templateUrl: 'assets/frontend/partials/pages/studios/index.html',
        controller: 'StudiosController',
        sources: ['studios', 'careers']
      })

      .state('pages-studios-show', {
        url: '/:lang/studios/:location',
        templateUrl: 'assets/frontend/partials/pages/studios/show.html',
        controller: 'StudiosItemController',
        sources: ['studios', 'careers']
      });
  }]);
})();
(function() {
  'use strict';

  var module = angular.module('dada.studios');

  module.factory('studiosResolverFactory', studiosResolverFactory);

  studiosResolverFactory.$inject = ['$http', '$state', 'studioFactory', 'studioCollectionFactory'];
  

  function studiosResolverFactory($http, $state, Studio, StudioCollection) 
  {
    var getAll = function() 
    {
      return $http({method: 'GET', cache: true, url: 'backend/api/studios.json'})
        .then(function(result) {
          var formatted = new StudioCollection();
          formatted.populate([]);

          result.data.forEach(function(item) {
            var model = new Studio();
            model.populate('studio', item);
            formatted.push(model);
          });

          return formatted;
        });
    };

    var get = function(slug) {
      return getAll().then(function(formatted) {
        formatted = formatted.all().filter(function(item) {
          return item['location-slug'] == slug;
        });

        if (formatted[0]) {
          return formatted[0];
        }

        $state.go('pages-404');
      });
    };

    var getTweets = function(studio) {
      return $http({method: 'GET', url: 'backend/social/twitter/' + studio });
    };

    var getInstagramPosts = function(studio) {
      return $http.jsonp('backend/social/instagram/' + studio + '?callback=JSON_CALLBACK');
    };

    return {
        get: get,
        getAll: getAll,
        getTweets: getTweets,
        getInstagramPosts: getInstagramPosts
    };
  }
})();
(function() {
  'use strict';

  var module = angular.module('dada.studios');

  module.directive('taleo', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        url: '@',
        img: '@'
      },
      template: '<a href="{{url}}&img={{img}}" type="submit" id="submit_button" target="_blank">Apply Now</a>'
    };
  });
})();
(function () {
  'use strict';

  var module = angular.module('dada.studios');

  module.controller('StudiosController', StudiosController);

  StudiosController.$inject = ['$scope','$stateParams', '$timeout', 'studiosResolverFactory', 'preloaderService', 'EventDetection'];
  function StudiosController($scope,$stateParams, $timeout, studios, PreloaderService, EventDetection) {
    $scope.$on('animate.ready', function () {
      $scope.$emit('animate.init');

      $scope.Math = window.Math;

      $scope.setBreadcrumbs([{'title': 'STUDIOS', 'ref': 'pages-studios-index', 'color': 'studios'}]);
        $scope.setHeaderDisplay(false);
         $scope.setPagetitle("Paris | Studio");
        //console.log($scope.headerDisplay);
    $scope.language = $stateParams.lang;
      $scope.showVideo = typeof EventDetection.getTransitionEvent() !== 'undefined';

      studios.getAll()
        .then(function (data) {
          $scope.data = data.all();
        });
    });
  }
})();

(function() {
  'use strict';

  var module = angular.module('dada.studios');

  module.controller('StudiosItemController', StudiosItemController);

  StudiosItemController.$inject = [
    '$scope',
    '$timeout',
    '$stateParams',
    'twitterFactory',
    'instagramFactory',
    'studiosResolverFactory',
    'careerResolverFactory',
    'workResolverFactory'
  ];

  function StudiosItemController($scope, $timeout, $stateParams, Twitter, Instagram, studios, career, work) {
    $scope.$on('animate.ready', function() {
      $scope.$emit('animate.init');

      studios.get($stateParams.location)
        .then(function(data) 
        {
          $scope.theStudio = data;

          $scope.setBreadcrumbs([
            {'title': 'STUDIOS', 'ref': 'pages-studios-index', 'color': 'studios'},
            {'title': $scope.theStudio.title, 'color': ''}
          ]);
              $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

          return career.getAllGroupedByStudio($stateParams.location);
        })

        .then(function(data) {
          $scope.careers = data;
          return work.getAllByStudio($stateParams.location);
        })

        .then(function(data) {
          $scope.workGrid = data.data.templatize();
          $scope.workResponsive = data.data.paginate(1);

          studios.getTweets($stateParams.location)
            .then(function(data) {
              if ( ! data.data) {
                return;
              }

              var tweet = new Twitter();
              tweet.populate('twitter', data.data[0]);
              $scope.tweet = tweet;
            });

          studios.getInstagramPosts($stateParams.location)
            .then(function(data) {
              if ( ! data.data) {
                return;
              }

              var result = data.data;

              var formatted = [];
              for (var i = 0; i < result.length; i++) {
                var instagram = new Instagram();
                instagram.populate('instagram', result[i]);

                formatted.push(instagram);
              }

              $scope.instagram = formatted;
            });

          $timeout(function() {
            $scope.$emit('animate.enter', true);
          });
      });
    });
  }
})();

(function() {
  var module = angular.module('dada.career', [
    'ui.router',
    'models.custom.career'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-career-index', {
        url: '/careers',
        templateUrl: 'assets/frontend/partials/pages/career/index.html',
        controller: 'CareerController',
        sources: ['studios', 'career']
      })

      .state('pages-career-show', {
        url: '/careers/:category',
        templateUrl: 'assets/frontend/partials/pages/career/show.html',
        controller: 'CareerItemController',
        sources: ['studios', 'career']
      });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.career');

  module.factory('careerResolverFactory', ['$http', '$state', 'careerFactory', function ($http, $state, Career) {
    var getAll = function () {
      return $http({method: 'GET', cache: true, url: 'backend/api/career.json'})
        .then(function (result) {
          return result.data;
        });
    };

    var getAllByCategory = function (slug) {
      return getAll().then(function (formatted) {
        if (formatted.data[slug]) {
          return formatted.data[slug];
        }

        $state.go('errors-404');
      });
    };

    var getAllGroupedByStudio = function (studio) {
      return getAll().then(function (result) {
        var formatted = {};
        var myStudio = studio.substr(0, 1).toUpperCase() + studio.substr(1);

        // get all the category names
        var keys = [];
        for (var k in result.data) keys.push(k);

        // add in the formatted array only the careers of that studio
        for (var i = 0; i < keys.length; i++) {
          for (var j = 0; j < result.data[keys[i]].careers.length; j++) {

            if (myStudio == result.data[keys[i]].careers[j].location) {
              var model = new Career();
              model.populate('career', result.data[keys[i]].careers[j]);

              if (typeof formatted[model.location] === "undefined") {
                formatted[model.location] = {
                  career: []
                };
              }

              formatted[model.location].career.push(model);
            }
          }
        }

        return formatted[myStudio] || [];
      });
    };

    var getAllGroupedByCareer = function () {
      return getAll().then(function (result) {
        var formatted = {};
        formatted.career = [];

        // get all the category names
        var keys = [];
        for (var k in result.data) keys.push(k);

        // add in the formatted array only the careers of that studio
        for (var i = 0; i < keys.length; i++) {
          for (var j = 0; j < result.data[keys[i]].careers.length; j++) {
            var model = new Career();
            model.populate('career', result.data[keys[i]].careers[j]);
            model.slug = result.data[keys[i]].slug;
            model.image = result.data[keys[i]].image;
            model.category = result.data[keys[i]].category;
            formatted.career.push(model);
          }
        }

        return formatted;
      });
    };

    return {
      getAll: getAll,
      getAllByCategory: getAllByCategory,
      getAllGroupedByStudio: getAllGroupedByStudio,
      getAllGroupedByCareer: getAllGroupedByCareer
    };
  }]);
})();

(function () {
  'use strict';

  var module = angular.module('dada.career');

  module.controller('CareerController', ['$scope', '$timeout', 'careerResolverFactory', 'preloaderService', function ($scope, $timeout, career, PreloaderService) {
    $scope.$on('animate.ready', function () {
      $scope.$emit('animate.init');

      $scope.setBreadcrumbs([{ 'title': 'CAREERS', 'ref': 'pages-career-index', 'color': 'career' }]);
        $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

      career.getAll()
        .then(function (data) {
          $scope.career = data.data;
          $scope.overview = data.overview;

          var content = [];
          for (var i in data.data) {
            if (data.data.hasOwnProperty(i)) {
              content = content.concat(data.data[i]);
            }
          }

          var preloader = new PreloaderService();
          return preloader.preloadAll(content, data.overview);
        })
        .then(function () {
          $scope.$emit('animate.enter');
        });
    });
  }]);
})();



(function () {
  'use strict';

  var module = angular.module('dada.career');

  module.controller('CareerItemController', ['$scope', '$timeout', '$location', '$stateParams', 'careerResolverFactory', 'preloaderService', function ($scope, $timeout, $location, $stateParams, career, PreloaderService) {
    $scope.$on('animate.ready', function () {
      $scope.$emit('animate.init');

      career.getAllByCategory($stateParams.category)
        .then(function (data) {
          $scope.career = data;
          $scope.permalink = $location.$$absUrl;

         // $scope.setBreadcrumbs([{ 'title': 'CAREERS', 'ref': 'pages-career-index', 'color': 'career' }, { 'title': $scope.career.category, 'color': '' }]);
              $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

          var preloader = new PreloaderService();
          return preloader.preloadAll(data);
        })
        .then(function () {
          $scope.$emit('animate.enter', true);
        });
    });
  }]);
})();
(function() {
  var module = angular.module('dada.search', [
    'ui.router',
    'models.custom.search',
    'dada.think'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('controls-search', {
        abstract: true,
        template: '<search></search>',
        controller: 'SearchController'
      })

      .state('controls-search.details', {
        url: '/:lang/search',
        views: {
          'term': {
            templateUrl: 'assets/frontend/partials/controls/search.html',
            controller: 'SearchTermsController'
          },
          'results': {
            templateUrl: 'assets/frontend/partials/controls/search-results.html',
            controller: 'SearchResultsController'
          }
        }
      });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.search');

  SearchDirectiveController.$inject = ['$scope', '$q', '$timeout', 'EventDetection', 'Debounce'];
  function SearchDirectiveController($scope, $q, $timeout, EventDetection, Debounce) {
    $scope.showResults = false;

    $scope.animateIn = false;
    $scope.showSearch = true;

    var termsScope;
    var resultsDisplayScope;
    var $searchBoxElement;

    var terms = {};

    var self = this;
    $scope.$on('$forcePopulate', function (params, term, results) {
      self.populateTerm(term, results);

      $timeout(function () {
        self.showResults();
      }, 1500);
    });

    var $filters;

    var filtersHeight = 0;
    var filtersScrollHeight = 0;

    var diff = (filtersScrollHeight / filtersHeight) - 1;  // widths difference ratio
    var padding = 60;  // Mousemove Padding
    var damp = 20;  // Mousemove response softness
    var mX = 0;   // Real mouse position
    var mX2 = 0;   // Modified mouse position
    var posX = 0;

    var mmAA = filtersHeight - (padding * 2); // The mousemove available area
    var mmAAr = (filtersHeight / mmAA);    // get available mousemove fidderence ratio

    $scope.scrollFilters = Debounce.debounce(function ($event) {
      if (!$filters) {
        return;
      }

      mX = $event.y - this.offsetLeft;
      mX2 = Math.min(Math.max(0, mX - padding), mmAA) * mmAAr;

      posX += (mX2 - posX) / damp; // zeno's paradox equation "catching delay"
      $filters.css({ marginTop: -posX * diff });
    }, 10, true);

    this.registerFilter = function (filters) {
      $filters = $(filters);
      filtersHeight = $filters.outerHeight();
      filtersScrollHeight = $filters[0].scrollHeight;
    };

    this.showResults = function (digest) {
      $scope.showResults = true;

      $timeout(function () {
        $scope.animateIn = true;
      });

      resultsDisplayScope.makeActive();

      if (digest) {
        $scope.$digest();
      }
    };

    this.addTerm = function (key, value) {
      terms[key] = value;
    };

    this.registerTerms = function (scope) {
      termsScope = scope;
    };

    this.registerResultsDisplay = function (scope) {
      resultsDisplayScope = scope;
    };

    this.registerSearchBox = function (element) {
      $searchBoxElement = $(element);
    };

    this.populateTerm = function (term, results) {
      resultsDisplayScope.displayTerm(term, results);
      $searchBoxElement.hide();
    };

    this.selectTerm = function (term, tag, results) {
      var defer = $q.defer();

      var $search = $('#search-term-' + term);
      var $exclude = $('.search-terms-result').not($search);

      $searchBoxElement.animate({ opacity: 0 });
      $exclude.animate({ opacity: 0 });

      var searchInputOffset = $searchBoxElement.offset();
      var searchOffset = $search.position();

      $search.css({ transition: 'transform 0.5s ease-in-out', transform: 'translateY(0px)' });
      $search.css({ transform: 'translateY(' + (searchInputOffset.top - searchOffset.top + 25) + 'px)' });

      var transitionEvent = EventDetection.getTransitionEvent();

      var resolve = function () {
        resultsDisplayScope.displayTerm(tag, results);
        $timeout(function () {
          $scope.showSearch = false;
        }, 0);

        defer.resolve();
      }

      if (typeof transitionEvent === 'undefined') {
        resolve();
      } else {
        $search.on(transitionEvent, function () {
          resolve();
        });
      }

      return defer.promise;
    };
  }

  module.directive('search', function () {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div ng-class="{\'search-results-focus\': showResults}" class="full-height-container"><terms></terms><results></results></div>',
      controller: SearchDirectiveController
    };
  });

  module.directive('searchBox', function () {
    return {
      restrict: 'EA',
      replace: true,
      require: '^search',
      template: [
        '<div id="search-container" class="SearchContainer">',
          '<form class="searchPos" autocomplete="off">',
            '<div class="textCenterOnly">',
              '<div id="copy-field" class="copyField" ng-class="{\'takeOver\': fieldClicked}" ng-bind="selected"></div>',
              '<img class="blinker beginAnim"  ng-src="{{typing == true && \'assets/frontend/images/blinker.png\' || \'assets/frontend/images/blinker.gif\'}}" ng-style="{\'margin-right\': offset + \'px\'}" />',
            '</div>',
            '<input id="search-field" class="searchField fieldClicked bold" type="text" name="searchField" ng-model="selected" ng-trim="false" ng-click="clear()" />',
          '</form>',
        '</div>'
      ].join(''),
      link: function (scope, element, attrs, controller) {
        controller.registerSearchBox(element);
      }
    }
  });

  module.directive('terms', function () {
    return {
      restrict: 'EA',
      replace: true,
      require: '^search',
      template: '<div ui-view name="term" class="animate-in-init animate-in-enter animate-in-enter-complete search-terms accelerate noflicker"></div>'
    };
  });

  module.directive('termsResult', ['$timeout', '$location', '$q', function ($timeout, $location, $q) {
    return {
      restrict: 'EA',
      replace: true,
      require: '^search',
      scope: {
        result: '='
      },
      template: [
        '<div id="search-term-{{result.slug}}" class="search-terms-result">',
        '<a ng-click="search()" ng-class="{\'active\': result.active}">{{result.tag}}</a>',
        '</div>'
      ].join(''),
      link: function (scope, element, attr, controller) {
        scope.$watch('result.select', function (value) {
          if (value === true) {
            scope.search();
          }
        });

        scope.search = function () {
          var defer = $q.defer();

          defer.promise.then(function (results) {
            controller.selectTerm(scope.result.slug, scope.result.tag, results)
              .then(function () {
                $timeout(function () {
                  controller.showResults(true);
                }, 1000);
              });
          });

          $location.search('search', scope.result.slug);
          scope.$on('$resultsAreIn', function (params, value) {
            defer.resolve(value);
          });
        };

        controller.addTerm(scope.result.slug, scope);
      }
    };
  }]);

  module.directive('termsResultDisplay', function () {
    return {
      restrict: 'EA',
      replace: true,
      require: '^search',
      template: [
        '<div id="terms-result-display" ng-show="term.length > 0" ng-class="{\'terms-result-display-active\': active}">' +
        '<div class="search-terms-result-term" ng-bind-html="term"></div>' +
        '<div class="search-terms-result-number opacity-animate" ng-class="{\'opacity-animate-on\': numberOfResults > 0}"><ng-pluralize count="numberOfResults" when="{\'0\': \'0 Results\', \'one\': \'1 Result\', \'other\': \'{} Results\'}"></ng-pluralize></div>' +
        '</div>'
      ].join(''),
      link: function (scope, element, attrs, controller) {
        scope.term = '';
        scope.active = false;
        scope.numberOfResults = 0;

        scope.displayTerm = function (term, results) {
          scope.term = term;
          scope.numberOfResults = results;
        };

        scope.makeActive = function () {
          scope.active = true;
        };

        scope.$on('$resultsAreIn', function (params, value) {
          scope.numberOfResults = value;
        });

        controller.registerResultsDisplay(scope);
      }
    }
  });

  module.directive('results', ['Debounce', function (Debounce) {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div ui-view name="results" class="search-results animate-in-init animate-in-enter animate-in-enter-complete search-results"></div>'
    };
  }]);

  module.directive('resultsFilter', function () {
    return {
      restrict: 'EA',
      require: '^search',
      replace: true,
      transclude: true,
      template: '<ul ng-transclude class="filterList"></ul>',
      link: function (scope, element, attrs, controller) {
        controller.registerFilter(element);
      }
    };
  });
})();

(function() {
    angular.module('dada.search').factory('searchResolverFactory', Search);

    Search.$inject = ['searchFactory'];
    function Search(Search) {
        var data;

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        var getAll = function(work, publications, news) {
            if (data) {
                return data;
            }

            var formatted = [];

            var searchObj, i;

            for (i = 0; i < work._data.length; i++) {
                searchObj = new Search();
                searchObj.populate('search', {model: work._data[i]});
                formatted.push(searchObj);
            }

            for (i = 0; i < publications.length; i++) {
                searchObj = new Search();
                searchObj.populate('search', {model: publications[i]});
                formatted.push(searchObj);
            }

            for (i = 0; i < news.length; i++) {
                searchObj = new Search();
                searchObj.populate('search', {model: news[i]});
                formatted.push(searchObj);
            }

            return data = formatted;
        };

        // keep the operation in memory to prevent extra work
        var extractedTags = [];

        function extractTags(searchData) {
            if (extractedTags.length) {
                return extractedTags;
            }

            var unordered = searchData.reduce(function(prev, current) {
                for (var tag in current['search-tags']) {
                    prev[tag] = current['search-tags'][tag];
                }

                return prev;
            }, {});

            var ordered = {};
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });

            return extractedTags = ordered;
        }

        function filter(data, term) {
            var sorted = data.reduce(function(prev, current) {
                var currentTags =
                    extractTagsFromString(current['search-expertise'])
                    .concat(extractTagsFromString(current['search-industries']))
                    .concat(extractTagsFromString(current['search-studios']))
                    .concat(current['tags'])
                    .map(cleanSearchTerms);

                if (currentTags.indexOf(term) > -1) {
                    var key = current['base-type'] == 'work' ? 'work' : 'other';
                    prev[key].push(current);
                }

                return prev;
            }, { work: [], other: [] });

            shuffleArray(sorted.other);

            return [].concat(sorted.work).concat(sorted.other);
        }

        /**
         * @param tags
         * @returns {Array}
         */
        function extractTagsFromString(tags) {
            if (tags) {
                return tags.split(',');
            }

            return [];
        }

        function cleanSearchTerms(term) {
            if (term) 
            {
               
              // var refinedterms = term.replace(',','-').toLowerCase();
               console.log(term);
             //  console.log(term.replace(/[^A-Z0-9-]+/ig, "-").toLowerCase());
                //console.log(term.replace(/\s/g, '-').replace('&', 'and').toLowerCase());
                //return term.replace(/[^a-zA-Z0-9\-_]/','-').replace('&', '-').toLowerCase();
             //  return term.replace(/\s+/g, '-').replace('&', '-').toLowerCase();
               return term.replace(/[^A-Z0-9]+/ig, "-").replace(',','-').toLowerCase();
            }

            return '';
        }

        return {
            getAll: getAll,
            getAllTags: extractTags,
            filter: filter
        };
    }

})();

(function() {
    'use strict';

    angular.module('dada.search').controller('SearchController', SearchController);

    SearchController.$inject = [
        '$scope',
        '$q',
        'workResolverFactory',
        'publicationsResolverFactory',
        'newsResolverFactory'
    ];

    function SearchController($scope, $q, work, publications, news) {
        $scope.data = [];

        $scope.broadcastResults = function(value)
        {

            $scope.$broadcast('$resultsAreIn', value);
        };

        $scope.broadcastForcePopulate = function(term, results) {
            $scope.$broadcast('$forcePopulate', term, results);
        };

        $scope.$on('animate.ready', function() {
            $scope.$emit('animate.init', 'slide-in-up');

            $q.all({
                work: work.getAll(),
                publications: publications.getAll(),
                news: news.getAll()
            }).then(function(results) {
                $scope.data = []
                    .concat([results.work.data])
                    .concat([results.publications])
                    .concat([results.news]);

                $scope.setBreadcrumbs([]);
                $scope.setHeaderDisplay(false);
                $scope.setPagetitle("Search");
                //console.log($scope.headerDisplay);

                $scope.$emit('animate.enter');
            });
        });
    }

})();

(function() {
    angular.module('dada.search').controller('SearchResultsController', SearchResultsController);

    SearchResultsController.$inject = [
        '$scope',
        '$location',
        'searchResolverFactory'
    ];

    function SearchResultsController($scope, $location, searchResolver) {
        $scope.resultsGrid = [];

        $scope.selectedFilters = {
            work: false,
            publications: false,
            news: false,
            studios: false
        };

        $scope.visibleFilters = [];

        function punchItChewy() {
            var data = searchResolver.getAll.apply(this, $scope.data);

            console.log($scope.data);

            $scope.search = $location.search().search;
            $scope.filters = $location.search().filters || '';

            $scope.selectedFilters = selectFiltersFromString($scope.filters, $scope.selectedFilters);

            var resultsGrid = [];
            var size = 8;

            var originalResults = searchResolver.filter(
                data, $scope.search
            );

            $scope.visibleFilters = getVisibleFilters(originalResults);

            var results = shallowCopyResults(originalResults).filter(applyFilters($scope.selectedFilters));
            getResults($scope, results, size, resultsGrid);
            console.log(originalResults);

            $scope.clearSearch = function() {
                window.location.replace('en/search');
            };

            $scope.isVisible = function(key) {
                return $scope.visibleFilters.indexOf(key) > -1;
            };

            $scope.selectFilter = function(type) {
                $scope.selectedFilters[type] = !$scope.selectedFilters[type];

                var filters = [];

                for (var key in $scope.selectedFilters) {
                    if ($scope.selectedFilters[key]) {
                        filters.push(key)
                    }
                }

                $location.search('filters', filters.join());
                var results = shallowCopyResults(originalResults).filter(applyFilters($scope.selectedFilters));

                getResults($scope, results, size, resultsGrid);
            };

            // pass an empty array as we should already have
            var allTags = searchResolver.getAllTags(data);

            return allTags[$scope.search];
        }

        if ($location.search().search) {
            // wait for data and execute immediately
            var listener = $scope.$watch('data', function(value) {
                if (value.length > 0) {
                    // warp speed
                    $scope.broadcastForcePopulate(punchItChewy(), $scope.resultsLength);
                    listener();
                }
            });
        } else {
            // wait for search term and data then change
            $scope.$on('$locationChangeSuccess', function() {
                if ( ! $location.search().search) {
                    return;
                }

                // if we have data (most likely) then punchItChewy
                if ($scope.data.length > 0) {
                    punchItChewy();
                } else {
                    // just in case we don't have data wait for it to be ready, this should never happen
                    var listener = $scope.$watch('data', function(value) {
                        if (value.length > 0) {
                            punchItChewy();
                        }
                        listener();
                    });
                }
            });
        }

        function selectFiltersFromString(filters, current) {
            filters = filters.split(',');

            var selected = {};
            for (var i in current) {
                selected[i] = filters.indexOf(i) > -1;
            }

            return selected;
        }

        function shallowCopyResults(results) {
            var copy = [];

            for (var i = 0; i < results.length; i++) {
                copy.push(results[i]);
            }

            return copy;
        }

        function getVisibleFilters(results) {
            return results.reduce(function(prev, current) {
                if (prev.indexOf(current['base-type']) < 0) {
                    prev.push(current['base-type']);
                }

                return prev;
            }, []);
        }

        function applyFilters(filters) {
            var allTrue = Object
                .keys(filters)
                .every(function(k) { return filters[k] == false });

            if (allTrue) {
                return function () {
                    return true;
                }
            }

            return function(result) {
                return filters[result['base-type']];
            }
        }

        function getResults($scope, results, size, resultsGrid) {
            $scope.broadcastResults(results.length);
            $scope.resultsLength = results.length;
            resultsGrid = renderResults(results, size);
            $scope.resultsGrid = resultsGrid;
        }

        function renderResults(results, size) {
            var resultsGrid = [];

            // array into chunks
            while (results.length > 0) {
                resultsGrid.push(results.splice(0, size));
            }

            return resultsGrid;
        }

    }
})();

(function() {
    'use strict';

    angular.module('dada.search').controller('SearchTermsController', SearchTermsController);

    SearchTermsController.$inject = [
        '$scope',
        '$timeout',
        'searchResolverFactory'
    ];

    var TERM_SELECT_DIRECTION_UP = 0;

    var TERM_SELECT_DIRECTION_DOWN = 1;

    function SearchTermsController($scope, $timeout, search) {
        var highlightedTerm = 0;

        $scope.typing = false;
        $scope.selected = '';
        $scope.results1 = [];
        $scope.results2 = [];

        console.log("searchtermcontroller");

        var filterResults = function(direction) {
            if (direction === TERM_SELECT_DIRECTION_UP) {
                for (var i = $scope.results2.length - 1; i >= 0; i--) {
                    if ($scope.results2[i].active === true) {
                        $scope.results2[i].active = false;

                        if ($scope.results2[i - 1]) {
                            $scope.results2[i - 1].active = true;
                        }

                        $scope.$digest();
                        return;
                    }
                }

                var found = false;

                for (var i = $scope.results1.length - 1; i >= 0; i--) {
                    if ($scope.results1[i].active === true) {
                        if ($scope.results1[i - 1]) {
                            $scope.results1[i].active = false;
                            $scope.results1[i - 1].active = true;
                        }

                        found = true;
                        break;
                    }
                }

                if (found === false && $scope.results1[$scope.results1.length - 1]) {
                    $scope.results1[$scope.results1.length - 1].active = true;
                }
            } else {
                for (var i = 0; i < $scope.results1.length; i++) {
                    if ($scope.results1[i].active === true) {
                        $scope.results1[i].active = false;

                        if ($scope.results1[i + 1]) {
                            $scope.results1[i + 1].active = true;
                        }

                        $scope.$digest();
                        return;
                    }
                }

                var found = false;

                for (var i = 0; i < $scope.results2.length; i++) {
                    if ($scope.results2[i].active === true) {

                        if ($scope.results2[i + 1]) {
                            $scope.results2[i].active = false;
                            $scope.results2[i + 1].active = true;
                        }

                        found = true;
                        break;
                    }
                }

                if (found === false && $scope.results2[0]) {
                    $scope.results2[0].active = true;
                }
            }

            $scope.$digest();
        };

        document.addEventListener('keydown', function(event) {
            if ([38, 40, 13].indexOf(event.keyCode) !== -1) {
                event.preventDefault();
            }

            switch(event.keyCode) {
                case 38: // up
                    filterResults(TERM_SELECT_DIRECTION_UP);
                    break;
                case 40: // down
                    filterResults(TERM_SELECT_DIRECTION_DOWN);
                    break;
                case 13:
                    for (var i = 0; i < $scope.results1.length; i++) {
                        if ($scope.results1[i].active === true) {
                            $scope.results1[i].select = true;
                            break;
                        }
                    }

                    for (var i = 0; i < $scope.results2.length; i++) {
                        if ($scope.results2[i].active === true) {
                            $scope.results2[i].select = true;
                        }
                    }

                    $scope.$apply();
            }
        });

        var listener = $scope.$watch('data', function(value) {
            if (value.length > 0) {
                var mySearchArray = search.getAll.apply(this, $scope.data);
                var mySearchTagsArray = search.getAllTags(mySearchArray);

                var limit = 9;

                var init = false;

                var clicked = false;

                var placeholder = 'Search';

                $scope.typing = false;
                $scope.selected = placeholder;
                $scope.results1 = [];
                $scope.results2 = [];

                // haxxor
                var $copyField = $('#copy-field');
                $timeout(function() {
                    $scope.offset = Math.round($copyField.width() / 2) + 3;
                }, 0);

                $scope.$on('animate.complete', function() {
                    $('#search-field').trigger('focus');
                });

                $scope.clear = function() {
                    if ($scope.selected === placeholder && clicked === false) {
                        $scope.selected = '';
                        init = true;
                        clicked = true;
                    }
                };

                $scope.$watch('selected', function(newType, oldType) {
                    if (oldType === newType) {
                        return;
                    }

                    highlightedTerm = 0;

                    if (init === false) {
                        if (newType === placeholder.substr(0, placeholder.length - 1)) {
                            $scope.selected = '';
                        } else {
                            $scope.selected = newType.substr(newType.length - 1);

                            if ($scope.selected === '') {
                                $scope.offset = 0;
                            }
                        }

                        init = true;
                        return;
                    }

                    $scope.offset = -(Math.round($copyField.width() / 2) + 5);

                    $scope.typing = true;
                    $timeout(function() {
                        $scope.typing = false;
                    }, 1000);

                    var results = [];

                    for (var tag in mySearchTagsArray) {
                        var term = mySearchTagsArray[tag].toLowerCase();
                        if (term.indexOf($scope.selected.toLowerCase()) > -1) {
                            results.push({tag: mySearchTagsArray[tag], slug: tag, active: false, select: false});
                        }
                    }

                    var theResults = [];
                    var middle = (Math.floor(results.length / 2) == 0) ? 1 : Math.floor(results.length / 2);
                    var boundary = ((limit - 1) / 2);

                    while(results.length > 0) {
                        theResults.push(results.splice(0, middle));
                    }

                    if (theResults.length > 1) {
                        $scope.results1 = theResults[0].slice(0, boundary);
                        $scope.results2 = theResults[1].slice(0, boundary);
                    } else if (theResults.length == 1) {
                        $scope.results1 = theResults[0].slice(0, boundary);
                        $scope.results2 = [];
                    } else {
                        $scope.results1 = [];
                        $scope.results2 = [];
                    }

                    if ($scope.selected == '') {
                        $scope.results1 = [];
                        $scope.results2 = [];
                    }
                });

                listener();
            }
        });
    }

})();

(function() {
  var module = angular.module('dada.contact', [
    'ui.router',
    'dada.studios'
  ]);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-contact', {
        url: '/:lang/contact',
        templateUrl: 'assets/frontend/partials/pages/contact.html',
        controller: 'ContactController',
        sources: ['studios']
      });
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.contact');

  module.controller('ContactController', ['$scope','$stateParams', '$http', 'studiosResolverFactory', function ($scope, $stateParams, $http, studios) {
    $scope.$on('animate.ready', function ()
    {
      console.log('contact controller');
      $scope.$emit('animate.init');

      $scope.setBreadcrumbs([{ 'title': 'CONTACT', 'ref': 'pages-contact', 'color': 'contact' }]);
        $scope.setHeaderDisplay(false);
        $scope.language = $stateParams.lang;
        $scope.show_footer = false;
      //  console.log($scope.headerDisplay);

        studios.getAll()
        .then(function (data) 
        {
          var studioData = data.all();

          $scope.$emit('animate.enter');

          var formatted = [];
          for (var i = 0; i < studioData.length; i++) 
          {
            formatted.push({ key: studioData[i].email, value: studioData[i].title });
          }

         
      //    $scope.choice = '';

       //   $scope.studios = formatted;

        //  console.log($scope.studios);

         // $scope.sending = true;
        //  $scope.complete = false;
        //  $scope.error = false;

       

///          $scope.studioHide = false;

        });
    });
  }]);
})();
(function() {
  var module = angular.module('dada.info', []);

  module.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('pages-info-privacy', {
        url: '/privacy-policies',
        templateUrl: 'assets/frontend/partials/pages/info/privacy-policies.html',
        controller: 'PrivacyController',
        sources: ['privacy-policies']
      })

      .state('pages-info-terms', {
        url: '/terms-and-conditions',
        templateUrl: 'assets/frontend/partials/pages/info/terms-and-conditions.html',
        controller: 'TermsController',
        sources: ['terms-and-conditions']
      })
  }]);
})();
(function () {
  'use strict';

  var module = angular.module('dada.info');

  module.factory('termsResolverFactory', ['$http', '$state', function ($http, $state) {
    var getAll = function () {
      return $http({method: 'GET', url: 'backend/api/terms-and-conditions.json'})
        .then(function (result) {
          if (result.data) {
            return result.data;
          }

          $state.go('errors-404');
        });
    };

    return {
      getAll: getAll
    };
  }]);
})();

(function () {
  'use strict';

  var module = angular.module('dada.info');

  module.factory('privacyResolverFactory', ['$http', '$state', function ($http, $state) {

    var getAll = function () {
      return $http({method: 'GET', url: 'backend/api/privacy-policies.json'})
        .then(function (result) {
          if (result.data) {
            return result.data;
          }

          $state.go('errors-404');
        });
    };

    return {
      getAll: getAll
    };
  }]);
})();

(function () {
  'use strict';

  var module = angular.module('dada.info');

  module.controller('TermsController', TermsController);

  TermsController.$inject = [
    '$scope', '$timeout', 'termsResolverFactory', 'preloaderService'
  ];

  function TermsController($scope, $timeout, terms, PreloaderService) {
    $timeout(function () {
      $scope.$emit('animate.init');
    });

    terms.getAll()
      .then(function (data) {
        $scope.data = data;

        $scope.setBreadcrumbs([]);
            $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

        var preloader = new PreloaderService();
        return preloader.preloadAll(data);
      })
      .then(function () {
        $scope.$emit('animate.enter', true);
      });
  }
})();

(function () {
  'use strict';

  var module = angular.module('dada.info');

  module.controller('PrivacyController', PrivacyController);

  PrivacyController.$inject = [
    '$scope', '$timeout', 'privacyResolverFactory', 'preloaderService'
  ];

  function PrivacyController($scope, $timeout, privacy, PreloaderService) {
    $timeout(function () {
      $scope.$emit('animate.init');
    });

    privacy.getAll()
      .then(function (data) {
        $scope.data = data;

        $scope.setBreadcrumbs([]);
            $scope.setHeaderDisplay(false); console.log($scope.headerDisplay);

        var preloader = new PreloaderService();
        return preloader.preloadAll(data);
      })
      .then(function () {
        $scope.$emit('animate.enter', true);
      });
  }
})();

(function(window) {
    'use strict';

    var directive = window.angular.module('cergis.directives.accordian', []).directive;

    directive('angularAccordion', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="angular-accordion-container"></div>',
            scope: {},
            controller: function() {
                var panes = [];

                this.expandPane = function(paneToExpand) {
                    angular.forEach(panes, function(iteratedPane) {
                        if (paneToExpand !== iteratedPane) {
                            iteratedPane.expanded = false;
                        }
                    });
                };

                this.addPane = function(pane) {
                    panes.push(pane);
                };
            }
        };
    });

    directive('pane', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="angular-accordion-pane"></div>'
        };
    });

    directive('paneHeader', function() {
        return {
            restrict: 'EA',
            require: '^angularAccordion',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="angular-accordion-header" ng-click="toggle()" ng-class="{ angularaccordionheaderselected: expanded, angulardisabledpane: disabled }"></div>',
            link: function(scope, element, attributes, controller) {
                scope.expanded = false;
                scope.passOnExpand = attributes.passOnExpand;
                scope.disabled = attributes.disabled;
                controller.addPane(scope);

                attributes.$observe('disabled', function(value) {
                    scope.disabled = (value === 'true');
                });

                scope.toggle = function() {
                    if (!scope.disabled) {
                        scope.expanded = ( !scope.expanded);

                        if (scope.expanded) {
                            scope.$emit('angular-accordion-expand', scope.passOnExpand);
                        }

                        controller.expandPane(scope);
                    }
                };

                scope.$on('expand', function(event, eventArguments) {
                    if (eventArguments === scope.passOnExpand) {
                        if (!scope.expanded) {
                            scope.toggle();
                        }
                    }
                });
            }
        };
    });

    directive('paneContent', function() {
        return {
            restrict: 'EA',
            require: '^paneHeader',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="angular-accordion-pane-content" ng-show="expanded"></div>'
        };
    });
})(window);
(function (window) {
  'use strict';

  var directive = window.angular.module('cergis.directives.animations', []).directive;

  directive('animateIn', ['$q', '$timeout', '$animate', 'EventDetection', function ($q, $timeout, $animate, EventDetection) {
    // elements
    var previousElement = null;
    var currentElement = null;

    var setup = false;

    return {
      restrict: 'A',
      controller: ['$scope', '$rootScope', '$element', function ($scope, $rootScope, $element) {
        // set elements up
        previousElement = currentElement;
        currentElement = $element;

        // before initial ui-view disappears, only when the site first loads
        if (previousElement === null) {
          setup = true;

          return;
        }

        // on the first fade in we need this class to be applied synchronously, other times it must only be applied on init event
        if (setup === true) {
          setup = false;

          currentElement.addClass('animate-in-init default');
          currentElement.removeClass('animate-in-enter');
          currentElement.removeClass('animate-in-enter-complete');
        }

        var lastModifier = null;
        $scope.$on('animate.init', function (event, modifier) {
          // set up class
          if (currentElement.hasClass('animate-in-init') === false) {
            currentElement.addClass('animate-in-init');
            if (lastModifier) {
              currentElement.removeClass(lastModifier);
              lastModifier = null;
            } else {
              currentElement.removeClass('default');
            }
          }

          if (typeof modifier === 'string') {
            currentElement.addClass(modifier);
            lastModifier = modifier;
          } else {
            currentElement.addClass('default');
          }
        });

        $timeout(function () {
          // allow setup
          $rootScope.$broadcast('animate.ready');

          // set the pager on or off
          var pagerDisabled = false;

          // set transitioning value, we assume it is by default
          var transitioning = true;
          var eventReceived = false;
          var forceImmediate = false;

          // if there are page transitions still active, make sure we wait
          if (previousElement) {
            previousElement[0].addEventListener(EventDetection.getAnimationEvent(), function (event) {
              if (typeof $(event.target).attr('animate-in') !== 'undefined') {
                if (event.originalEvent.propertyName === 'transform') {
                  transitioning = false;
                  enter();
                }
              }
            });
          } else {
            transitioning = false;
            enter();
          }

          // listen for the enter event
          $scope.$on('animate.enter', function (event, disablePager, immediate) {
            $timeout(function () {
              eventReceived = true;
              pagerDisabled = (disablePager === true);
              forceImmediate = (immediate === true || typeof EventDetection.getTransitionEvent() === 'undefined');
              enter();
            }, 200);
          });

          // listen for the enter event
          $scope.$on('animate.hide', function (event, callback) {
            currentElement.addClass('animate-in-hide');

            // listens for when all animations are complete and disables pager if they are
            currentElement.on(EventDetection.getTransitionEvent(), function (event) {
              var $target = $(event.target);

              var transform = event.originalEvent.propertyName && event.originalEvent.propertyName.match(/^(.+)?(transform)$/) !== null;
              if (typeof $target.attr('animate-in') !== 'undefined' && transform) {
                callback();
                currentElement.removeClass('animate-in-hide');
              }
            });
          });

          var deferred = $q.defer();

          // check the the page has finished transitioning and we have received the enter event before firing
          function enter() {
            if (eventReceived) {
              deferred.resolve();
            }
          }

          function complete() {
            currentElement.addClass('animate-in-enter-complete');
            $rootScope.$broadcast('animate.complete');
            $scope.$emit('loader.hide');

            if (pagerDisabled)
            {
              $scope.$emit('pager.disable');
            }
          }

          // add the classes to start the animation
          deferred.promise.then(function () {
            currentElement.addClass('animate-in-enter');
            currentElement.removeClass('animate-in-enter-complete');

            if (forceImmediate) {
              complete();
            }
          });

          // listens for when all animations are complete and disables pager if they are
          currentElement.on(EventDetection.getTransitionEvent(), function (event) {
            var $target = $(event.target);

            var transform = event.originalEvent.propertyName && event.originalEvent.propertyName.match(/^(.+)?(transform)$/) !== null;
            if (typeof $target.attr('animate-in') !== 'undefined' && transform) {
              currentElement.off();
              complete();
            }
          });
        });
      }]
    }
  }]);
})(window);

(function(window) {
    'use strict';

    var directive = window.angular.module('cergis.directives.breadcrumbs', []).directive;

    directive('animateAuto', ['$timeout', 'Debounce', function($timeout, Debounce) {
        // tracks the original size defined by the directive
        var originalWidth;
        var originalHeight;

        // tracks the calculated size
        var currentWidth;

        // set the state variables
        var queue = false;
        var animating = false;

        var $element;
        var $crumbs;

        $(window).resize(Debounce.debounce(function() {
            if ($element && $crumbs) {
                animateComplete();
            }
        }, 200, true));

        /**
         * @param $crumbs
         * @param $element
         */
        function animateStart() {
            animating = true;

            currentWidth = originalWidth;
            if (window.innerWidth > 1024) {
                currentWidth -= 16;
            }

            $element.animate({
                width: currentWidth + 'px',
                height: originalHeight + 'px',
                overflow: 'hidden'
            }, 500, function() {
                $crumbs.css({
                    position: 'fixed',
                    visibility: 'hidden',
                    left: 0
                });

                animating = false;
                if (queue) {
                    animateComplete();
                    queue = false;
                }
            });
        }

        /**
         * @param $crumbs
         * @param $element
         */
        function animateComplete() {
            if (animating) {
                queue = true;
                return;
            }

            $crumbs.css({
                position: 'absolute',
                marginLeft: originalWidth + 'px',
                visibility: 'visible',
                width: '1000px'
            });

            $timeout(function() {
                currentWidth = originalWidth + $crumbs.children('.oh-by-golly-crumbs-width').width();
                if (window.innerWidth > 1024) {
                    currentWidth -= 16;
                }

                $element.animate({
                    width: currentWidth + 'px'
                });
            }, 200);
        }

        return {
            restrict: 'A',
            scope: {
                'animateAutoDefaultWidth': '@',
                'animateAutoDefaultHeight': '@'
            },
            link: function(scope, element) {
                originalWidth = Number(scope.animateAutoDefaultWidth);
                originalHeight = Number(scope.animateAutoDefaultHeight);

                // get the elements we'll be working with and set their initial values
                $element = $(element[0]);
                $crumbs = $element.find('.oh-by-golly-crumbs');

                currentWidth = originalWidth;
                if (window.innerWidth > 1024) {
                    currentWidth -= 16;
                }

                $element.css({width: currentWidth + 'px', height: originalHeight + 'px', overflow: 'hidden'});
                $crumbs.css({position: 'fixed', visibility: 'hidden', left: 0});

                // on resize animate to current width, adjusting for resolution
                scope.$on('$stateChangeStart', function() {
                    animateStart();
                });

                scope.$on('animate.complete', function() {
                    animateComplete();
                });
            }
        };
    }]);

})(window);
(function(window) {
    'use strict';

    var directive = window.angular.module('cergis.directives.carousel', []).directive;

    directive('owlCarousel', ['$timeout', '$document', '$location', 'Debounce', 'EventDetection', function($timeout, $document, $location, Debounce, EventDetection) {
        var pager = function($el, scope) {
            function isFirst(index) {
                return index < 1;
            }

            function isLast(count, index) {
                return count - 1 === index;
            }

            var debounceMouseWheelInput = Debounce.debounce(function(params) {
                var emitEvents = typeof scope.emitEvents === 'string' ? scope.emitEvents : 'true';
                emitEvents = (emitEvents === 'true');

                params.force = params.force === true || false;

                if (params.force || params.page.scope.component === scope.id) {
                    var data = $el.data('owlCarousel');

                    if (params.$deltaY < 1) {
                        if (isLast(data._items.length, data._current) && emitEvents) {
                            scope.$emit('pager.unlock.down');
                        } else {
                            $el.trigger('next.owl.carousel');
                        }
                    } else {
                        if (isFirst($el.data('owlCarousel')._current) && emitEvents) {
                            scope.$emit('pager.unlock.up');
                        } else {
                            $el.trigger('prev.owl.carousel');
                        }
                    }
                }
            }, 200, true);

            scope.$on('pager.input', function(event, params) {
                debounceMouseWheelInput(params);
            });
        };

        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="full-height-container"></div>',
            scope: {
                id: '@',
                emitEvents: '@',
                owlOptions: '@',
                trackIndex: '=',
                waitForAnimate: '=',
                showControlsThreshold: '=',
                enablePager: '=',
                first: '=',
                last: '='
            },
            link: function(scope, element) {
                var defaultOptions = {
                    items: 1,
                    smartSpeed: 500,
                    nav: true,
                  //  loop:true,
                     //nav: $(".owl-carousel > .item").length <= 1 ? false : true,
                  // dots: false,
                    loop:$(".owl-carousel > .item").length <= 1 ? false : true,
                };

                var options = scope.$eval(scope.owlOptions) || {};
                for (var i in defaultOptions) {
                    if (defaultOptions.hasOwnProperty(i) && typeof options[i] === 'undefined') {
                        options[i] = defaultOptions[i];
                    }
                }

                var $el = $(element);
                var index = $location.search().index;

                if (scope.trackIndex === true && typeof EventDetection.getTransitionEvent() !== 'undefined') {
                    scope.index = (typeof index === 'undefined') ? 0 : Number($location.search().index);

                    /**
                     * This is because $location.search doesn't update the URL if it's triggered inside a non-angular context.
                     */
                    scope.$watch('index', function(value) {
                        $location.search('index', value);
                    });

                    $el.on('translated.owl.carousel', function(event) {
                        scope.index = event.page.index;
                        scope.$apply();
                    });
                }

                if (scope.enablePager === true) {
                    scope.$on('pager.init', function () {
                        pager($el, scope);
                    });
                } else {
                    $document.bind('keyup', function(event) {
                        switch (event.keyCode) {
                            case 39:
                                $el.trigger('next.owl.carousel');
                                break;
                            case 37:
                                $el.trigger('prev.owl.carousel');
                                break;
                            default:
                                break;
                        }
                    });
                }

                var init = function() {
                    if (scope.showControlsThreshold && $el.children().length <= scope.showControlsThreshold) {
                        options.nav = false;
                    }

                    if (typeof index !== 'undefined') {
                        options.startPosition = Number(index);
                    }

                    $el.owlCarousel(options);
                };

                if (scope.waitForAnimate === true) {
                    scope.$on('animate.complete', function() {
                        $timeout(function() {
                            init();
                        });
                    });
                } else {
                    $timeout(function() {
                        init();
                    });
                }
            }
        };
    }]);

    directive('owlCarouselItem', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            template: '<div ng-transclude></div>'
        };
    });

})(window);

(function (window) {
  'use strict';

  var directive = window.angular.module('cergis.directives.cache-refresh', []).directive;

  directive('cacheRefresh', ['$state', '$window', '$http', function ($state, $window, $http) {
    function reload() {
      $window.location.reload();
    }

    return {
      restrict: 'A',
      link: function (scope, element) {
        element.on('click', function () {
          var sources = $state.current.sources || [];
          if (sources.length) {
            $http.get('/backend/api/clear_cache?keys=' + sources.join('|'))
              .then(reload);
          } else {
            alert('Nothing to clear!');
          }
        });
      }
    }
  }]);
})(window);
(function (window) {
    'use strict';

    var directive = window.angular.module('cergis.directives.gmap', []).directive;

    function ZoomControl(controlDiv, map) {
        // Creating divs & styles for custom zoom control
        controlDiv.style.padding = '12px';
        controlDiv.className = 'mobHide';

        // Set CSS for the control wrapper
        var controlWrapper = document.createElement('div');
        controlWrapper.style.cursor = 'pointer';
        controlWrapper.style.textAlign = 'center';
        controlWrapper.style.width = '32px';
        controlWrapper.style.height = '68px';
        controlDiv.appendChild(controlWrapper);

        // Set CSS for the zoomIn
        var zoomInButton = document.createElement('div');
        zoomInButton.style.width = '32px';
        zoomInButton.style.height = '32px';
        /* Change this to be the .png image you want to use */
        zoomInButton.style.backgroundImage = 'url(assets/frontend/images/map_plus.svg)';
        zoomInButton.style.backgroundSize = '32px 32px';
        zoomInButton.style.marginBottom = '4px';
        controlWrapper.appendChild(zoomInButton);

        // Set CSS for the zoomOut
        var zoomOutButton = document.createElement('div');
        zoomOutButton.style.width = '32px';
        zoomOutButton.style.height = '32px';
        /* Change this to be the .png image you want to use */
        zoomOutButton.style.backgroundImage = 'url(assets/frontend/images/map_minus.svg)';
        zoomOutButton.style.backgroundSize = '32px 32px';
        controlWrapper.appendChild(zoomOutButton);

        // Setup the click event listener - zoomIn
        google.maps.event.addDomListener(zoomInButton, 'click', function () {
            map.setZoom(map.getZoom() + 1);
        });

        // Setup the click event listener - zoomOut
        google.maps.event.addDomListener(zoomOutButton, 'click', function () {
            map.setZoom(map.getZoom() - 1);
        });
    }

    function splitAddress(address) {
        var line1 = null;
        var line2 = null;

        if (address && typeof address == 'string' && address.length) {
            line1 = address
                .split(',')
                .map(function (line) {
                    return line.trim();
                });

            var country = line1.pop();
            var area = line1.pop();

            line1 = line1.join(', ');
            line2 = [area, country].join(', ')
        }

        return {line1: line1, line2: line2}
    }

    function initMap(element, studioLat, studioLong, address, telephone, fax, email) {
        var latLng = new google.maps.LatLng(studioLat, studioLong);

        var map = new google.maps.Map(element[0], {
            scrollwheel: false,
            zoom: 19,
            center: latLng,
            disableDefaultUI: true,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        });

        var marker = new google.maps.Marker({
            position: latLng,
            title: 'Point A',
            map: map,
            draggable: true,
            icon: 'zef'
        });

        var zoomControlDiv = document.createElement('div');
        var zoomControl = new ZoomControl(zoomControlDiv, map);
        zoomControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(zoomControlDiv);

        var addressLines = splitAddress(address);

        var contentString = [
          '<div id="content">',
            '<div id="site-notice">',
            '</div>',
            '<div class="info-window-content">',
              '<p>',
                (addressLines.line1 ? addressLines.line1 + '<br>' : ''),
                (addressLines.line2 ? addressLines.line2 + '<br>' : ''),
                (telephone && telephone.length ? 'Tel: ' + telephone + '<br>' : ''),
                (fax && fax.length ? 'Tel: ' + fax + '<br>' : ''),
                (email && email.length ? '<a href="mailto:' + email + '">' + email + '</a>' : ''),
              '</p>',
            '</div>',
          '</div>'
        ].join('');


        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        google.maps.event.addListenerOnce(map, 'idle', function () {
            infowindow.open(map, marker);
        });

        google.maps.event.addListener(infowindow, 'domready', function () {
            // Reference to the DIV which receives the contents of the infowindow using jQuery
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();

            // Remove the background shadow DIV
            iwBackground.children(':nth-child(2)').css({'display': 'none'});

            // Change the background color DIV
            iwBackground.children(':nth-child(4)').css({'backgroundColor': '#cdd600'});

            // Remove the shadow
            iwBackground.children(':nth-child(1)').attr('style', function (i, s) {
                return s + 'display: none!important;'
            });

            // Moves the arrow to the left & rotate
            iwBackground.children(':nth-child(3)').attr('style', function (i, s) {
                return s + 'background-color :#cdd600!important;'
            });

            iwBackground.children(':nth-child(3)')

            // Change the Arrow color & shadow
            iwBackground.children(':nth-child(3)').children(':nth-child(1)').children(':nth-child(1)').css({
                'backgroundColor': '#cdd600',
                'boxShadow': 'none'
            });
            iwBackground.children(':nth-child(3)').children(':nth-child(2)').children(':nth-child(1)').css({
                'backgroundColor': '#cdd600',
                'boxShadow': 'none'
            });

            var iwCloseBtn = iwOuter.next();
            iwCloseBtn.css({display: 'none'});
        });
    }

    var template = [
        '<div class="gmap-container"><div id="gmap"></div><div class="gmap-overlay"></div></div>'
    ].join('');

    directive('gmap', [function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: template,
            scope: {
                latitude: '@',
                longitude: '@',
                address: '@',
                telephone: '@',
                fax: '@',
                email: '@'
            },
            link: function (scope, element) {
                window.gMapsCallback = function () {
                    $(window).trigger('gMapsLoaded');
                }

                function loadGoogleMaps() {
                    var script_tag = document.createElement('script');
                    script_tag.setAttribute("type", "text/javascript");
                    script_tag.setAttribute("src", "http://maps.google.com/maps/api/js?key=AIzaSyDqBFnwVB_vAFuk3J_cxX6P7K_-KlB8vaw&callback=gMapsCallback");

                    /**
                     * Testing API key.
                     *
                     * script_tag.setAttribute("src", "http://maps.google.com/maps/api/js?key=AIzaSyApkdyxJbuFbVR5DG10f4ys3ZE1bb7BdCo&callback=gMapsCallback");
                     */

                    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
                }

                $(window).bind('gMapsLoaded', initMap.bind(
                    this, element.find('#gmap'), scope.latitude, scope.longitude, scope.address, scope.telephone, scope.fax, scope.email
                ));

                loadGoogleMaps();
            }
        };
    }]);
})(window);

(function (window) {
  'use strict';

  var directive = window.angular.module('cergis.directives.content-links-new-tab', []).directive;

  var nonDomainRegex = /(http|https):\/\/(dada\.app|stage\.dada\.com|www\.dada\.com)/;
  var relativeUrlRegex = /^(\/)?(work|think|news|careers|about|studios|publications)/;

  directive('contentLinksNewTab', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        $timeout(function() {
          var links = element.find('a');
          links.each(function() {
            var link = $(this);

            // remove existing target
            link.removeAttr('target');

            var href = link.attr('href');

            var isRelative = href.match(relativeUrlRegex) !== null;
            var isOnDomain = href.match(nonDomainRegex) !== null;

            if ( ! isOnDomain && ! isRelative) {
              link.attr('target', '_blank');
            }

            // remove trailing slashes as they no longer work
            if (isRelative && href.match(/\/$/) !== null) {
              link.attr('href', href.slice(0, -1));
            }
          });
        });
      }
    };
  }]);
})(window);

(function () {
  'use strict';

  var directive = angular.module('cergis.directives.map', []).directive;

  directive('map', function () {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'assets/frontend/partials/pages/footer.html',
      controller: ['$scope', function ($scope) {
        $scope.cities = {};

        $scope.addCity = function (title, scope) {
          $scope.cities[title] = scope;
        };

        $scope.select = function (title) {
          for (var i in $scope.cities) {
            if ($scope.cities.hasOwnProperty(i)) {
              $scope.cities[i].selected = (i === title);
            }
          }
        };

        $scope.hideText = function () {
          for (var i in $scope.cities) {
            if ($scope.cities.hasOwnProperty(i) && $scope.cities[i].selected === true) {
              return true;
            }
          }

          return false;
        };

        $scope.conDelay = function (delayBool) {
          if (delayBool == false) {
            return 600;
          }

          else {
            return 0;
          }
        }
      }]
    };
  });

  directive('mapCity', function () {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'assets/frontend/partials/pages/map.html',
      link: function (scope) {
        scope.selected = false;
        scope.isSelected = function () {
          return scope.selected === true;
        };

        scope.$parent.addCity(scope.studio.title, scope);
      }
    };
  });

  directive('mobMap', function () {
    return {
      restrict: 'EA',
      replace: true,
      template: '<a ui-sref="/studios/{{studio[\'location-slug\']}}">{{studio.title}}</a>'
    };
  });

  directive('pageFooter', function () {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: '<div class="page-footer" ng-transclude></div>'
    };
  });

  directive('dateNow', ['$filter', function ($filter) {
    return {
      link: function ($scope, $element, $attrs) {
        $element.text($filter('date')(new Date(), $attrs.dateNow));
      }
    };
  }])
})();
(function(window) {
    'use strict';

    var directive = window.angular.module('cergis.directives.pager', []).directive;

    PagerController.$inject = [
        '$scope',
        '$timeout',
        '$location',
        '$element',
        '$document',
        '$filter',
        'EventDetection',
        'Debounce'
    ];

    function PagerController($scope, $timeout, $location, $element, $document, $filter, EventDetection, Debounce) {
        /**
         * PRIVATE PROPERTIES
         */

        /**
         * Local variable to hold timeout functions.
         */
        var peakTimeout;

        /**
         * A number of milliseconds to wait before allowing the next page to "peak" up and show the next page.
         *
         * @type {number}
         */
        var peakDelay = 500;

        /**
         * An artificial delay to prevent mouse events from firing too fast.
         *
         * @type {number}
         */
        var eventRebindDelay = 0;

        /**
         * Constants for use in comparisons.
         *
         * @type {number}
         */
        var DIRECTION_UP = 1;
        var DIRECTION_DOWN = 2;

        /**
         * Get the supported transition event.
         *
         * @type {string}
         */
        var transitionEvent = EventDetection.getTransitionEvent();

        /**
         * Shortcut to see if transitions are suuported by the browser.
         *
         * @type {boolean}
         */
        var transitionsSupported = typeof transitionEvent === 'string';

        /**
         * UTILITY FUNCTIONS
         */

        function isBusy() {
            return $scope.busy;
        }

        function isLocked(direction) {
            if ($scope.deferredUnlockUp === true || $scope.deferredUnlockDown === true) {
                if ($scope.deferredUnlockUp === true) {
                    $scope.locked = (direction === DIRECTION_DOWN);
                }

                if ($scope.deferredUnlockDown === true) {
                    $scope.locked = (direction === DIRECTION_UP);
                }

                $scope.deferredUnlockUp = $scope.deferredUnlockDown = false;

                return false;
            }

            return $scope.locked;
        }

        function isNotFirstPage() {
            return $scope.page > 0;
        }

        function isNotLastPage() {
            return $scope.page < ($scope.pages.length - 1);
        }

        /**
         * Set the timeout for when the next page "peaks".
         *
         * @returns {$timeout}
         */
        var initPeak = function () {
            $scope.$on('animate.complete', function () {
                return $timeout(function () {
                    if ($scope.peak === false && $scope.locked === false && isNotLastPage()) {
                        $scope.peak = true;
                    }
                }, peakDelay);
            });
        };

        /**
         * Any time the page changes, this function is called to set it up.
         *
         * @returns {void}
         */
        var initTransition = function (direction) {
            if (transitionsSupported) {
                $scope.busy = true;
            }

            $scope.direction = direction;

            $timeout.cancel(peakTimeout);

            $scope.peak = false;
        };

        var footerOpen = function() {
            if ($scope.footer === null) {
                return;
            }

            if ($scope.showFooter === true) {
                $scope.footerHasFocus = true;

                if (transitionsSupported === false) {
                    $scope.footerFocusComplete = true;
                }
            } else {
                $scope.showFooter = true;
            }
        };

        var footerClose = function(direction) {
            if ($scope.footer === null) {
                return false;
            }

            if ($scope.showFooter === true) {
                if ($scope.footerHasFocus === true) {
                    $scope.footerHasFocus = false;
                    $scope.footerFocusComplete = false;
                } else {
                    $scope.showFooter = false;
                    $scope.locked = $scope.last().scope.locked === true;
                }

                return true;
            }

            return false;
        };

        /**
         * INIT CODE
         */

        peakTimeout = initPeak();

        /**
         * SCOPE VARS
         */

        /**
         * The current page index in the lst of pages.
         *
         * @type {number}
         */
        var initPage = $location.search().page;
        $scope.page = (typeof initPage === 'undefined') ? 0 : Number(initPage);

        /**
         * Controls the next page peaking over the top of the previous one.
         *
         * @type {boolean}
         */
        $scope.peak = false;

        /**
         * Defines the current direction to allow us to predict what the next page will be before it has transitioned.
         *
         * @type {number}
         */
        $scope.direction = DIRECTION_DOWN;

        /**
         * Locks the pages in place to prevent.
         *
         * @type {boolean}
         */
        $scope.locked = false;

        /**
         * Prevents an immediate transition from happening but allows for it on the next command.
         *
         * @type {boolean}
         */
        $scope.deferredUnlockUp = false;

        /**
         * Prevents an immediate transition from happening but allows for it on the next command.
         *
         * @type {boolean}
         */
        $scope.deferredUnlockDown = false;

        /**
         * Prevents transitions from happening mid-transitions.
         *
         * @type {boolean}
         */
        $scope.busy = false;

        /**
         * List of all of the pages that we can change to.
         *
         * @type {Array}
         */
        $scope.pages = [];

        /**
         * Container for the footer element.
         *
         * @type {object}
         */
        $scope.footer = null;

        /**
         * Move the viewport up so that the footer is revealed.
         *
         * @type {boolean}
         */
        $scope.showFooter = false;

        /**
         * Allow the footer to expand to make up the full height of the container.
         *
         * @type {boolean}
         */
        $scope.footerHasFocus = false;

        /**
         * Triggered when the animation is complete.
         *
         * @type {boolean}
         */
        $scope.footerFocusComplete = false;

        /**
         * SCOPE EVENT LISTENERS
         */

        $scope.$on('pager.unlock.up', function () {
            $scope.deferredUnlockUp = true;
            $scope.deferredUnlockDown = false;
        });

        $scope.$on('pager.unlock.down', function () {
            $scope.deferredUnlockDown = true;
            $scope.deferredUnlockUp = false;
        });

        $scope.$on('pager.lock', function () {
            $timeout(function () {
                $scope.locked = $scope.current().scope.locked === true;
                $scope.peak = false;
            }, 0);
        });

        $scope.$watch('page', function(value) {
            $location.search('page', value);
        });

        /**
         * SCOPE EVENT BROADCASTERS
         */

        $timeout(function () {
            $scope.$emit('pager.init');
            $scope.$broadcast('pager.init');
        }, 0);

        /**
         * SCOPE METHODS
         */

        /**
         * Get the current page scope and element.
         *
         * @returns {object}
         */
        $scope.current = function () {
            return $scope.pages[$scope.page];
        };

        /**
         * Get the first page scope and element.
         *
         * @returns {object}
         */
        $scope.first = function () {
            return $scope.pages[0];
        };

        /**
         * Get the last page scope and element.
         *
         * @returns {object}
         */
        $scope.last = function () {
            return $scope.pages[$scope.pages.length - 1];
        };

        /**
         * EVENTS
         */

        /**
         * Listens for keyboard events.
         */
        $document.bind('keyup', function(event) {
            switch (event.keyCode) {
                case 38:
                    $scope.mouseWheel(event, null, null, 1);
                    $scope.$digest();
                    break;
                case 40:
                    $scope.mouseWheel(event, null, null, 0);
                    $scope.$digest();
                    break;
                default:
                    break;
            }
        });

        /**
         * Binds to the msdWheel directive. Used to transition between pages.
         *
         * @param $event
         * @param $delta
         * @param $deltaX
         * @param $deltaY
         *
         * @returns {void}
         */
        var debounceMouseWheelInput = function($event, $delta, $deltaX, $deltaY) {
            var direction = $deltaY < 1 ? DIRECTION_DOWN : DIRECTION_UP;

            // check the footer isn't active and give it control if so
            if (direction === DIRECTION_UP && footerClose()) {
                return;
            }

            $scope.$broadcast('pager.input', {
                $event: $event,
                $delta: $delta,
                $deltaX: $deltaX,
                $deltaY: $deltaY,
                page: $scope.current()
            });

            if (isBusy() || isLocked(direction)) {
                return;
            }

            if (direction === DIRECTION_DOWN) {
                if (isNotLastPage()) {
                    initTransition(direction);

                    // turn off the current scope active
                    $scope.current().scope.selected = false;

                    // change the current page
                    $scope.page++;

                    // check the locked status
                    $scope.locked = $scope.current().scope.locked === true;

                    // give the new current scope active status
                    $scope.current().scope.selected = true;

                    // mark the new current page as initialized
                    $scope.current().scope.initialized = true;

                    $scope.$broadcast('pager.next');
                    $scope.$broadcast('pager.transitioned');
                } else {
                    footerOpen(direction);
                }
            } else {
                if (isNotFirstPage()) {
                    initTransition(direction);

                    // turn off the current scope active
                    $scope.current().scope.selected = false;

                    // change the current page
                    $scope.page--;

                    // check the locked status
                    $scope.locked = $scope.current().scope.locked === true;

                    // give the new current scope active status
                    $scope.current().scope.selected = true;

                    // mark the new current page as initialized
                    $scope.current().scope.initialized = true;

                    for (var i = ($scope.pages.length - 1); i > -1; i--) {
                        if ($scope.page === i) {
                            break;
                        }
                    }

                    $scope.$broadcast('pager.previous');
                    $scope.$broadcast('pager.transitioned');
                }
            }
        };

        var lastExecution = Date.now();
        var mouseWheelOSX = function($event, $delta, $deltaX, $deltaY) {
            var now = Date.now();

            if ((now - 1200) > lastExecution) {
                debounceMouseWheelInput($event, $delta, $deltaX, $deltaY);
                lastExecution = now;
            }
        };

        var debouncedMouseWheelInput = Debounce.debounce(debounceMouseWheelInput, 150, true);

        $scope.mouseWheel = function($event, $delta, $deltaX, $deltaY) {
            if (window.navigator.platform.match("^(Mac).+") === null) {
                debouncedMouseWheelInput($event, $delta, $deltaX, $deltaY);
            } else {
                mouseWheelOSX($event, $delta, $deltaX, $deltaY);
            }
        };

        $scope.swipeLeft = function($event) {
            $scope.$broadcast('pager.input', {
                $event: $event,
                $delta: null,
                $deltaX: 0,
                $deltaY: 0,
                force: true
            });
        };

        $scope.swipeRight = function($event) {
            $scope.$broadcast('pager.input', {
                $event: $event,
                $delta: null,
                $deltaX: 0,
                $deltaY: 1,
                force: true
            });
        };

        /**
         * Register a new page directive with the pager.
         *
         * @param page Should be an object literal containing `scope` and `element` keys.
         *
         * @returns {void}
         */
        this.addPage = function(page) {
            // if it's the first page added
            initPage = (typeof initPage === 'undefined') ? 0 : Number(initPage);
            if (page.scope.index === initPage) {
                page.scope.initialized = true;
                page.scope.selected = true;

                $scope.locked = page.scope.locked === true;

                if (typeof page.scope.data !== 'undefined') {
                    var image;
                    if (typeof page.scope.data.image === 'string') {
                        image = page.scope.data.image;
                    } else if (typeof page.scope.data.background !== 'undefined') {
                        image = (typeof page.scope.data.background === 'string') ? page.scope.data.background : page.scope.data.background.src;
                    }

                    if (image) {
                        var $image = $('<img/ >');

                        $image.attr('src', image);

                        $image.load(function() {
                            $(this).remove();
                            page.element.css('background-image', 'url("' + image + '")');
                            page.scope.$emit('animate.enter');
                        });

                        $image.error(function() {
                            $(this).remove();
                            page.scope.$emit('animate.enter');
                        });
                    } else
                    {
                        page.scope.$emit('animate.enter');
                    }
                } else {
                    if (page.scope.triggerAnimateIn !== false) {
                        page.scope.$emit('animate.enter');
                    }
                }
            }

            if (transitionsSupported) {
                page.element.on(transitionEvent, function (event) {
                    var checkPage = $scope.direction === DIRECTION_DOWN ? $scope.page : $scope.page + 1;
                    if (event.target === $scope.pages[checkPage].element[0]) {
                        var delay = eventRebindDelay;
                        if ($scope.current().scope.loaded === false && $scope.current().scope.data && $scope.current().scope.data.type === 'grid') {
                            delay = 0;
                        }

                        $timeout(function () {
                            $scope.busy = false;
                            $scope.current().scope.loaded = true;
                        }, delay);
                    }
                });
            }

            $scope.pages.push(page);
            $scope.pages.sort(function (a, b) {
                if (a.scope.index < b.scope.index) {
                    return -1;
                }

                if (a.scope.index > b.scope.index) {
                    return 1;
                }

                return 0;
            });
        };

        /**
         * Setup the pager with a footer.
         *
         * @param {object} element
         *
         * @returns {void}
         */
        $scope.setFooter = function (element) {
            $scope.footer = element;

            if (transitionsSupported) {
                $scope.footer.on(transitionEvent, function() {
                    if ($scope.footerHasFocus === true) {
                        $scope.footerFocusComplete = true;
                        $scope.$apply();
                    }
                });
            }
        };
    }

    directive('pager', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div><div ng-transclude ng-class="{\'page-peak\': peak, \'pager-show-footer\': showFooter, \'pager-footer-focus\': footerHasFocus, \'pager-footer-focus-complete\': footerFocusComplete}" msd-wheel="mouseWheel($event, $delta, $deltaX, $deltaY)"></div><div class="pager-chevron-container" ng-click="mouseWheel($event, null, null, 0)"><div class="pager-chevron"></div></div></div>',
            controller: PagerController
        };
    });

    directive('page', [function() {
        return {
            restrict: 'EA',
            replace: true,
            require: '^pager',
            transclude: true,
            template: '<div ng-transclude class="page" ng-class="{\'ng-show\': $parent.page >= index, \'page-next\': ($parent.page + 1) === index, \'page-selected\': selected, \'page-initialized\': initialized}"></div>',
            scope: {
                index: '=',
                locked: '=',
                data: '=',
                triggerAnimateIn: '=',
                component: '@'
            },
            link: function(scope, element, attr, controllers) {
                scope.loaded = false;

                scope.initialized = false;

                scope.selected = false;

                scope.index = Number(scope.index);

                scope.lock = function () {
                    scope.locked = true;
                };

                scope.unlock = function () {
                    scope.locked = false;
                };

                controllers.addPage({scope: scope, element: element});

$(".page-selected").removeClass("page-selected");
//$(".page-initialized" ).removeClass(".page-selected" );

            }
        };
    }]);

    directive('pagerFooter', ['EventDetection', function(EventDetection) {
        return {
            restrict: 'EA',
            transclude: true,
            require: '^pager',
            replace: true,
            template: '<div ng-transclude class="pager-footer"></div>',
            link: function (scope, element) {
                scope.$parent.setFooter(element);
            }
        }
    }]);
})(window);

(function(window) {
    'use strict';

    var directive = window.angular.module('cergis.directives.panel-zoom', []).directive;

    directive('panel', ['EventDetection', function (EventDetection) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            template: '<div ng-class="{zooming: animate}" ng-transclude></div>',
            scope: {
                item: '=',
                color: '='
            },
            link: function (scope, element) {

                scope.animate = false;
                scope.busy = false;
                scope.exitTriggered = false;

                element.on('mouseenter', function () {
                    scope.animate = true;
                    scope.busy = true;

                    scope.$apply();
                });

                element.on('mouseleave', function () {
                    if (scope.busy === false) {
                        scope.animate = false;

                        scope.$apply();
                    } else {
                        scope.exitTriggered = true;
                    }
                });

                element.on(EventDetection.getAnimationEvent(), function () {
                    if (scope.exitTriggered) {
                        scope.animate = false;
                        scope.exitTriggered = false;
                    }

                    scope.busy = false;

                    scope.$apply();
                });

            }
        };
    }]);

})(window);



(function (window) {
  'use strict';

  var directive = window.angular.module('cergis.directives.template-item', []).directive;

  directive('templateItem', function () {
    return {
      restrict: 'AE',
      replace: true,
      template: '<div ng-include="getTemplateUrl()"></div>',
      scope: {
        item: '=',
      },
      link: function (scope, element) {
        scope.getTemplateUrl = function () {
          var directory = scope.item.templateDirectory || 'content-templates/';
          var template = scope.item.template || '1-column-text';

          if (typeof scope.$parent.think !== "undefined") {
            element.next().find("h2").css("color", scope.$parent.$parent.$parent.colors.think);
          } else if (typeof scope.$parent.work !== "undefined") {
            element.next().find("h2").css("color", scope.$parent.$parent.$parent.colors.work);
          }

          return 'assets/frontend/partials/' + directory + template + '.html';
        };
      }
    }
  });

})(window);
(function() {
  'use strict';

  var directive = angular.module('cergis.directives.utils', []).directive;

  directive('backgroundImage', function () {
    return {
      link: function (scope, element, attrs) {
        element.css('background-image', "url('" + attrs.backgroundImage + "')");
      }
    };
  });
})();
(function(window) {
    'use strict';

    var directive = window.angular.module('cergis.directives.leadership', []).directive;

    directive('leadership', function() {
        return {
            restrict: 'A',
            controller: function() {
                var people = [];

                this.addPerson = function(scope) {
                    people.push(scope);
                    return people.length - 1;
                };

                this.play = function(id) {
                    for (var i = 0; i < people.length; i++) {
                        people[i].playing = (i === id);
                    }
                };
            }
        };
    });

    directive('leadershipPeople', function() {
        return {
            restrict: 'A',
            require: '^leadership',
            link: function(scope, element, attr, controllers) {
                var id = controllers.addPerson(scope);
                var $video = $(element).find('video').eq(0);

                scope.playing = false;

                scope.togglePlay = function() {
                    controllers.play(scope.playing ? '' : id);

                    $video[0][(scope.playing ? 'play' : 'pause')]();
                    $video[0].onended = function() {
                        scope.playing = false;
                        scope.$digest();
                    };
                };
            }
        }
    });

})(window);
(function(window) {
    'use strict';

    var service = window.angular.module('cergis.services.content-formatter', []).service;

    /**
     * Takes an object with a keyed order like `{overview: {...}, 0: {...}, 1: {...}}` and converts it to and array we
     * can iterate over like `{overview: {...}, data: [...]}`. This is to account for a limitation in ModX which is
     * providing the data.
     */
    service('contentFormatter', function() {
        var self = this;

        self.format = function(data) {
            var formatted = {
                data: []
            };

            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    if (isNaN(parseInt(i))) {
                        formatted[i] = data[i];
                    } else {
                        // convert to a string
                        var key = formatted.data.length + '';
                        formatted.data.push(data[key]);
                    }
                }
            }

            return formatted;
        };
    });
})(window);
(function(window) {
    'use strict';

    var service = window.angular.module('cergis.services.debounce', []).service;

    /**
     * Method is slightly modified version of debounce found in Underscore.js v1.4.4. Prevents certain functions bound
     * to certain events like window resize from killing the browser.
     */
    service('Debounce', function() {
        var self = this;

        self.debounce = function(func, wait, immediate) {
            var timeout;
            var args;
            var context;
            var timestamp;
            var result;

            var now = Date.now || function () {
                return new Date().getTime();
            };

            var later = function () {
                var last = now() - timestamp;

                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;

                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) {
                            context = args = null;
                        }
                    }
                }
            };

            return function () {
                context = this;
                args = arguments;
                timestamp = now();
                var callNow = immediate && !timeout;

                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }

                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        };

        return self;
    });
})(window);
(function(window) {
    'use strict';

    var service = window.angular.module('cergis.services.event-detection', []).service;

    service('EventDetection', function() {
        var service = {};

        var test = function(testThese) {
            var el = document.createElement('div');

            for(var i in testThese){
                if(testThese.hasOwnProperty(i) && typeof el.style[i] !== 'undefined'){
                    return testThese[i];
                }
            }
        };

        service.getTransitionEvent = function() {
            var transitions = {
                'transition'       :'transitionend',
                'OTransition'      :'oTransitionEnd',
                'MSTransition'     :'msTransitionEnd',
                'MozTransition'    :'transitionend',
                'WebkitTransition' :'webkitTransitionEnd'
            };

            return test(transitions);
        };

        service.getAnimationEvent = function() {
            var transitions = {
                'animation'       :'animationend',
                'OAnimation'      :'oAnimationEnd',
                'MSAnimation'     :'MSAnimationEnd',
                'MozAnimation'    :'mozAnimationEnd',
                'WebkitAnimation' :'webkitAnimationEnd'
            };

            return test(transitions);
        };

        return service;
    });
})(window);
(function(window) {
    'use strict';

    var service = window.angular.module('cergis.services.preloader', []).service;

    service('preloaderService', ['$q', '$filter', '$http', function($q, $filter, $http) {
        function Preloader() {
            this.resolver = $q.defer();
            this.queued = 0;
        }

        Preloader.prototype.loadImage = function(imgSrc) {
            var image = $(new Image());

            var self = this;

            image.on('load', function() {
                self.resolver.resolve(image);
            });

            image.on('error', function() {
                self.resolver.resolve(image);
            });

            image.prop('src', $filter('asset')(imgSrc));

            setTimeout(function() {
                image.prop('src', '');
            }, 2000);

            return self.resolver.promise;
        };

        Preloader.prototype.queue = function(image) {
            var self = this;

            self.queued++;

            var resolve = function() {
                self.queued--;
                if (self.queued === 0) {
                    self.resolver.resolve();
                }
            };

            var promise = self.loadImage(image);

            promise.then(function() {
                resolve();
            });
        };

        Preloader.prototype.preloadAll = function() {
            for (var i = 0; i < arguments.length; i++) {
                var data = arguments[i];

                if (!data || !data.length) {
                    continue;
                }

                for (var j = 0; j < data.length; j++) {
                    if (data[j].background === null || typeof data[j].background === 'undefined') {
                        continue;
                    }

                    if (typeof data[j].background === 'object' && typeof data[j].background.src === 'string') {
                        this.queue(data[j].background.src);
                    }

                    if (typeof data[j].background === 'string') {
                        this.queue(data[j].background);
                    }

                    if (typeof data[j].image === 'string') {
                        this.queue(data[j].image);
                    }
                }
            }

            // resolve immediately if nothing was queued
            if (this.queued < 1) {
                this.resolver.resolve();
            }

            return this.resolver.promise;
        };

        return Preloader;
    }]);
})(window);

(function(window) {
    'use strict';

    var service = window.angular.module('cergis.services.ify', []).service;

    service('ify', function () {
        return {
            'link': function (t) {
                return t.replace(/[a-z]+:\/\/[a-z0-9-_]+\.[a-z0-9-_:~%&\?\+#\/.=]+[^:\.,\)\s*$]/ig, function (m) {
                    return '<a href="' + m + '">' + ((m.length > 25) ? m.substr(0, 24) + '...' : m) + '</a>';
                });
            },
            'at': function (t) {
                return t.replace(/(^|[^\w]+)\@([a-zA-Z0-9_]{1,15}(\/[a-zA-Z0-9-_]+)*)/g, function (m, m1, m2) {
                    return m1 + '<a href="http://twitter.com/' + m2 + '">@' + m2 + '</a>';
                });
            },
            'hash': function (t) {
                return t.replace(/(^|[^&\w'"]+)\#([a-zA-Z0-9_]+)/g, function (m, m1, m2) {
                    return m1 + '<a href="https://twitter.com/hashtag/' + m2 + '">#' + m2 + '</a>';
                });
            },
            'clean': function (tweet) {
                return this.hash(this.at(this.link(tweet)));
            }
        };
    });

})(window);
(function (window) {
  'use strict';

  var filter = window.angular.module('cergis.filters', []).filter;

  filter('ordinalDate', ['$filter', function ($filter) {

    var getOrdinalSuffix = function (number) {
      var suffixes = ["'th'", "'st'", "'nd'", "'rd'"];
      var relevantDigits = (number < 30) ? number % 20 : number % 30;
      return (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    };

    /**
     * Look through the format string for any possible match for 'd'.
     * It needs to ignore 'dd' and also occurrences of the letter d inside
     * string such as "d 'day of' MM'.
     * @param format
     */
    var getIndecesOfDayCharacter = function (format) {
      var dayRegex = /(?:'(?:[^']|'')*')|(?:d+)/g;
      var matchingIndices = [];
      var finishedLooking = false;

      while (!finishedLooking) {
        var matches = dayRegex.exec(format);
        if (matches) {
          dayRegex.lastIndex = matches.index + matches[0].length;
          if (matches[0] === 'd') {
            matchingIndices.push(matches.index + 1);
          }
        } else {
          finishedLooking = true;
        }
      }

      return matchingIndices;
    };

    /**
     * Insert a string at a given index of another string
     * @param inputString
     * @param index
     * @param stringToInsert
     * @returns {string}
     */
    var insertAtIndex = function (inputString, index, stringToInsert) {
      var partBeforeIndex = inputString.substring(0, index);
      var partAfterIndex = inputString.substring(index, inputString.length);
      return partBeforeIndex + stringToInsert + partAfterIndex;
    };

    return function (timestamp, format) {
      var date = new Date(timestamp);
      var dayOfMonth = date.getDate();
      var suffix = getOrdinalSuffix(dayOfMonth);

      var matchingIndices = getIndecesOfDayCharacter(format);

      // now we to insert the suffix at the index(-ces) that we found
      for (var i = matchingIndices.length; i > 0; i--) {
        format = insertAtIndex(format, matchingIndices[i - 1], suffix);
      }
      return $filter('date')(date, format);
    };
  }]);

  filter('asset', function () {
    return function (path, width) {
      if (typeof path === 'string') {
        if (path.indexOf(settings.AWS_BASE_PATH) === 0) {
          width = width || 2000;
          path = path.replace(settings.AWS_BASE_PATH, '');
          return 'backend/resizer?image=' + path + '&width=' + width;
        } else if (path.match(/^(http|https):\/\/.+/) !== null) {
          return path;
        } else {
          return '/' + path.replace(/'/, "\\'");
        }
      }

      return '';
    };
  });

  filter('tel', function () {
    return function (number) {
      if (typeof number === 'string') {
        return 'tel:' + number;
      }

      return '';
    };
  });

  filter('mailto', function () {
    return function (mail) {
      if (typeof mail === 'string') {
        return 'mailto:' + mail;
      }

      return '';
    };
  });

  filter('trustUrl', ['$sce', function ($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);

  filter('searchTags', function () {
    return function (tags) {
      return tags && tags.length ? tags.split(',')[0] + '<br />' : '';
    };
  });

  filter('myLimitTo', function () {
    return function (obj, limit) {
      if (typeof obj !== "undefined") {
        var keys = Object.keys(obj);
        if (keys.length < 1) {
          return [];
        }

        var ret = {},
          count = 0;
        angular.forEach(keys, function (key) {
          if (count >= limit) {
            return false;
          }
          ret[key] = obj[key];
          count++;
        });
        return ret;
      } else {
        return null;
      }
    };
  });

})(window);

(function() {
  'use strict';

  var customModules = [
    'cergis.directives.accordian',
    'cergis.directives.masonry',
    'cergis.directives.animations',
    'cergis.directives.breadcrumbs',
    'cergis.directives.cache-refresh',
    'cergis.directives.content-links-new-tab',
    'cergis.directives.carousel',
    'cergis.directives.map',
    'cergis.directives.gmap',
    'cergis.directives.pager',
    'cergis.directives.panel-zoom',
   // 'cergis.directives.squeeky-video',
  //  'cergis.directives.auto-video',
    'cergis.directives.template-item',
    'cergis.directives.leadership',
    'cergis.directives.utils',
    'cergis.services.content-formatter',
    'cergis.services.debounce',
    'cergis.services.event-detection',
    'cergis.services.preloader',
    'cergis.filters',
    'main.controller',
    'navigation.controller',
    'dada.components.related-links',
    'dada.home',
    'dada.think',
    'dada.studios',
    'dada.search',
    'dada.work',
    'dada.news',
    'dada.publications',
    'dada.info',
    'dada.contact',
    'dada.career',
    'dada.about'
  ];

  var nativeModules = [
    'ngAnimate',
    'ngSanitize',
    'ngTouch'
  ];

  var extensionModules = [
    'ui.router',
    'truncate',
    'duScroll',
    'enrichit.angular-image-utils',
    'monospaced.mousewheel',
    'platanus.inflector',
    'perfect_scrollbar',
    'angular-inview'
  ];



  var modules = customModules.concat(nativeModules).concat(extensionModules);

  window.app = angular.module('app', modules, ['$httpProvider', '$logProvider', function($httpProvider, $logProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $logProvider.debugEnabled(true);
  }]);



  angular.module('app').directive('includeReplace', function() {
    return {
      require: 'ngInclude',
      restrict: 'A', /* optional */
      link: function (scope, el) {
        el.replaceWith(el.children());
      }
    };
  });
})();



(function(window) {
    'use strict';

    window.app.run(['$rootScope', '$state', '$urlRouter','$stateParams', function($rootScope, $state, $urlRouter,$stateParams)
     {
        $rootScope.$on('$stateChangeSuccess', function(event, toState) {
            $rootScope.pagerContent = toState.name.match(/^news|pages-home|pages-work-index|pages-studios-index/) ? true : false;
            $rootScope.pagerContentMobile = toState.name.match(/^controls-search/) ? true : false;

            $rootScope.showLoader = toState.name.match(/^controls-navigation/) ? false : true;
            $rootScope.controlsActive = toState.name.match(/^controls/) ? true : false;

            $rootScope.magToggle = toState.name === 'controls-search.details';
            $rootScope.menuActive = toState.name === 'controls-navigation';
            $rootScope.lang2= $stateParams.lang;
            $rootScope.sub_cat = $stateParams.id;

         //   console.log( $rootScope.lang2);
        });

        $rootScope.$on('$stateNotFound', function(event, unfound, params)
        {
            $state.go('errors-404');
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $state.go('errors-500');
            throw error;
        });
    }]);
})(window);

(function () {
  'use strict';

  window.app.config(['$stateProvider', '$compileProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $compileProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise(function($injector, $location){
      var state = $injector.get('$state');
      state.go('errors-404');
      return $location.path();
    });

    $locationProvider.html5Mode(true);

    $stateProvider




      .state('controls-navigation', {
        url: '/:lang/navigation',
        templateUrl: 'assets/frontend/partials/controls/navigation.html'
      })



      .state('errors-404', {
        templateUrl: 'assets/frontend/partials/pages/404.html',
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
          $scope.$on('animate.ready', function () 
          {

            $scope.$emit('pager.init');

            $timeout(function () {
              $scope.$emit('animate.enter');
            });
          });
        }]
      })




       .state('hi', {
          url: '/hi',
        templateUrl: 'assets/frontend/partials/pages/hi.html',
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
          $scope.$on('animate.ready', function () {
            $scope.$emit('pager.init');
              $scope.temp = "temp";
            $timeout(function () {
              $scope.$emit('animate.enter');
            });
          });
        }]
      })

       .state('ar', {
          url: '/ar',
        templateUrl: 'assets/frontend/partials/pages/ar.html',
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
          $scope.$on('animate.ready', function () {
            $scope.$emit('pager.init');
            $scope.temp = "temp";
            $timeout(function () {
              $scope.$emit('animate.enter');
            });
          });
        }]
      })

        .state('fr', {
          url: '/fr/',
     //   templateUrl: 'assets/frontend/partials/pages/fr.html'
       
      })




      .state('errors-500', {
        url: '/500',
        templateUrl: 'assets/frontend/partials/pages/500.html',
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
          $scope.$on('animate.ready', function () {
            $scope.$emit('pager.init');

            $timeout(function () {
              $scope.$emit('animate.enter');
            });
          });
        }]
      });
  }]);
})();
