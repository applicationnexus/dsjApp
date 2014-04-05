// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('dsjmobile', ['ionic', 'dsjmobile.services', 'dsjmobile.controllers', 'ui.i18n', 'ngSanitize', 'ui.bootstrap', 'chieffancypants.loadingBar', 'ngAnimate', 'ngCookies', 'jmdobry.angular-cache'])
/*--------+
| Routing |
+--------*/
.config(function($stateProvider, $urlRouterProvider) {
  // Learn more here: https://github.com/angular-ui/ui-router
  $stateProvider
  
    // Initial SPLASH Page for selecting site/language
    .state('splash', {
        url: '/splash',
        templateUrl: 'templates/splash.html',
        controller: 'lang'
    })

    // Main NAVIGATION Page (Grid)
    .state('nav', {
        url: '/nav',
        templateUrl: 'templates/nav.html',
        controller: 'lang'
    })

    .state('favourites', {
        url: '/favourites',
        templateUrl: 'templates/favourites.html',
        controller: 'lang'
    })

    // {JSON} VISITING page
    .state('visiting', {
      url: '/visiting',
          templateUrl: 'templates/visiting.html',
          controller: 'lang'
    })

    // {JSON} MAP page
    .state('map', {
      url: '/map',
          templateUrl: 'templates/map.html',
          controller: 'lang'
    })

    .state('map-nearby', {
      url: '/map/nearby/:placelat/:placelong',
          templateUrl: 'templates/map.html',
          controller: 'lang'
    })

    // {JSON} ACCOMMODATIONS (formerly under places, now it's own as it's just linking to jackrabbit)
    .state('accommodations', {
      url: '/accommodations',
          templateUrl: 'templates/accommodations.html',
          controller: 'lang'
    })
  
    // {JSON} THINGSTODO
    .state('thingstodo-index', {
      url: '/thingstodo',
          templateUrl: 'templates/thingstodo.html',
          controller: 'lang'
    })

    .state('thingstodo-detail', {
      url: '/thingstodo/:thingId',
          templateUrl: 'templates/thingstodo-detail.html',
          controller: 'lang'
    })

    // {JSON} EVENTS
    .state('events-index', {
      url: '/events',
          templateUrl: 'templates/events.html',
          controller: 'lang'
    })
    .state('events-detail', {
      url: '/events/:eventId',
          templateUrl: 'templates/events-detail.html',
          controller: 'lang'
    })

    // {JSON} DINING
    .state('dining-index', {
      url: '/dining',
          templateUrl: 'templates/dining.html',
          controller: 'lang'
    })

    .state('dining-detail', {
      url: '/dining/:diningId',
          templateUrl: 'templates/dining-detail.html',
          controller: 'lang'
    })

    // {JSON} SHOPPING
    .state('shopping-index', {
      url: '/shopping',
          templateUrl: 'templates/shopping.html',
          controller: 'lang'
    })

    .state('shopping-detail', {
      url: '/shopping/:shopId',
          templateUrl: 'templates/shopping-detail.html',
          controller: 'lang'
    })

    .state('accommodations-detail', {
      url: '/accommodations/:accomId',
          templateUrl: 'templates/accommodations-detail.html',
          controller: 'lang'
    })

  // if none of the above states are matched, use this as the fallback
  // TODO: conditional logic to default to the main nav if they've already made selection on the splash page.
  $urlRouterProvider.otherwise('/splash');

})

.run(function ($http, $angularCacheFactory) {

    $angularCacheFactory('defaultCache', {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 6000000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
    });

    $http.defaults.cache = $angularCacheFactory.get('defaultCache');

    console.log($http.defaults.cache);
})

/*------------------------------+
| DATE FILTERING WITH moment.js |
+------------------------------*/// do not use "m" (it's conflicting with google maps marker clusterer)
.filter('date1', function() { // filter the date as {Mar 10}
  return function(input) {
    //m = moment(input)
    if (moment(input).isValid()){
      //return m.fromNow();
      return moment(input).format('MMM D');
    } else {
      return input;
    }
  };
})

.filter('date2', function() { // filter the date as {March 10}
  return function(input) {
    //m = moment(input)
    if (moment(input).isValid()){
      return moment(input).format('MMMM D');
    } else {
      return input;
    }
  };
})

.filter('dateMonth', function() { // filter the date as {Mar}
  return function(input) {
    //m = moment({month: input});
    if (moment({month: input}).isValid()){
      return moment({month: input-1}).format('MMM'); //moment months are 0-11, where the dsj values are 1-12.
    } else {
      return input;
    }
  };
})

.filter('dateDDMMYYYY', function() { // filter the date as {Mar 10}
  return function(input) {
    //m = moment(input)
    if (moment(input).isValid()){
      //return m.fromNow();
      return moment(input).format('DD/MM/YYYY');
    } else {
      return input;
    }
  };
})

.filter('hoursfilter', function($rootScope) {
  return function(input) {
    //m = moment(input, "HH:mm"); //the current format 18:00 

    if (moment(input, "HH:mm").isValid()){
        if($rootScope.language == "fr"){
            return moment(input, "HH:mm").format("HH[h]mm"); //when french 18h 00
        }else{
            return moment(input, "HH:mm").format("h:mma"); //when english 6:00 pm
        }
    }else { //not valid date, maybe "closed" value
        if(input == "closed"){
            if($rootScope.language == "fr"){
                return "fermé";
            }else{
                return "closed";
            }
        }else{
            return input; //default return whatever was in db field.
        }
    }
  };
})
.filter('hoursfilter2', function($rootScope) { //TODO: consider extending the original hoursfilter above to also account for the second format
  return function(input) {
    //m = moment(input, "h:mm A"); //the current format for events

    if (moment(input, "h:mm A").isValid()){
        if($rootScope.language == "fr"){
            return moment(input, "h:mm A").format("HH[h]mm"); //when french 18h 00
        }else{
            return moment(input, "h:mm A").format("h:mma"); //when english 6:00 pm
        }
    } else { //not valid date, maybe "closed" value
        if(input == "closed"){
            if($rootScope.language == "fr"){
                return "fermé";
            }else{
                return input;
            }
        }else{
            return input; //default return whatever was in db field.
        }
    }
  };
})
.filter('dedup', function() {
  return function(places) {
    var deduped = [];
    var last_article = null;
    for(var i=0,max=places.length;i<max;i++) {
        var article = places[i];
        if(!last_article || last_article.article_title !== article.article_title)
        {
            article.related = [];
            deduped.push(article);
            last_article = article;
        } else {
            last_article.related.push(article);
        }
    }
    return deduped;
  };
})
/*----------------+
| EXTRA FILTERING |
+----------------*/
.filter('removeHttp', function(){ //consider extending this filter to create/format a url for clicking.
    return function(input){
      var url = input.indexOf("://");
      if(url != "-1"){
         url = input.substr(input.indexOf('://')+3);
      }else{
        url = input
      }
        return url
    }
})

/*--------------------+
| GET SCROLL POSITION |
+--------------------*/
.directive('scrollPosition', function($window) { //offsetTop
  return {
    scope: {
      scroll: '=scrollPosition'
    },
    link: function(scope, element, attrs) {
      //var windowEl = angular.element($window);
      var windowEl = angular.element($window).find('scroll');
      console.log(windowEl);
      console.log($window.find('scroll'));

      var handler = function() {
        scope.scroll = windowEl.scrollTop();
      }
      windowEl.on('scroll', scope.$apply.bind(scope, handler));
      handler();
    }
  };
})

/*-------------------+
| YOUTUBE VIDEO LINK |
+-------------------*/
.directive('youtube', function($rootScope) {
    var frame = '<iframe id="ytplayer" type="text/html" style="width:100%; height: 100%; margin-top:30px;" src="http://www.youtube.com/embed/DZ6R1nKUZXQ" frameborder="0" allowfullscreen>';
    if($rootScope.language == 'fr'){
        frame = '<iframe id="ytplayer" type="text/html" style="width:100%; height: 100%; margin-top:30px;" src="http://www.youtube.com/embed/MJ4RAFGKf_Y" frameborder="0" allowfullscreen>';
    }
  return {
    restrict: 'E',
    template: frame
  };
})

;//need this little guy at the end.

/*.config(function ($angularCacheFactoryProvider) {

    // optionally set cache defaults
    $angularCacheFactoryProvider.setCacheDefaults({  });

}).run(function ($angularCacheFactory) {

    // Create a cache here, or anywhere else. Just inject $angularCacheFactory
    var newCache = $angularCacheFactory('newCache', { 
        // This cache can hold 1000 items
        capacity: 1000,

        // Items added to this cache expire after 15 minutes
        maxAge: 900000,

        // Items will be actively deleted when they expire
        deleteOnExpire: 'aggressive',

        // This cache will check for expired items every minute
        recycleFreq: 60000,

        // This cache will clear itself every hour
        cacheFlushInterval: 3600000,

        // This cache will sync itself with localStorage
        storageMode: 'localStorage',

        // Custom implementation of localStorage
        storageImpl: myLocalStoragePolyfill,

        // Full synchronization with localStorage on every operation
        verifyIntegrity: true,
    });

});*/
/* NOTES:
 
/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework/Versions/A/Resources/BaseSupport.xclangspec //edit to remove xcode url mangling

    * sass --watch scss/app.scss:lib/css/app.css
    
    * everything is considered a view
    * potential for mobile device to ALSO be capturing drag events alongside the framework. Consider disabling when accessed via browser (should be fine in native)
    
    http://ionicframework.com/docs/guide/building.html
    * repeatable lists
    
    
    Structure -- each will have it's own state/collection

        thingstodo <-> select/list -> landing page              1   /thingstodo
        dining <-> select/list -> landing page                  2   /dining
        shopping <-> select/list -> landing page                3   /shopping
(stay)  accommodations <-> select/list -> landing page          4   /accommodations
        events <-> select/list -> landing page                  5   /events
        
        visiting <-> content <-> sidebar links                  6   /visiting
        
(blog)  news <-> list -> landing                                7   /high-tide-blog

        map <-> select/list -> external link                    8   /map
           
    Additional views -- can/could be included anywhere
    
        splash page                                             9   /splash
        main navigation -> play -> video (modal)                10  /navigation
        chat                                                    11  /chat
*/

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'dsjmobile' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

/*-------------+
| Localization |
+-------------*/
/*
var uiI18n = angular.module('ui.i18n');
// adding english here, the array specifies all the matchable languages for the strings.
uiI18n.add(["en", "en-us"],{
    groupPanel:{
        description:'Drag a column header here and drop it to group by that column.'
    },
    example: "I speak English"
});
uiI18n.add("de",{
    groupPanel:{
        description:'Ziehen Sie eine Spaltenüberschrift hierhin um nach dieser Spalte zu gruppieren.'
    },
    example: "I speak Something Else"
});

angular.module('ui.i18n').i18n.set("en-us");
*/

//Declare your i18n strings, this is enclosed in order to show that this can be done anywhere in the application
 (function(){
    var uiI18n = angular.module('ui.i18n');
    uiI18n.add(["en", "en-us"],{

    nav:{
        thingstodo: 'to do',
        dining: 'dining',
        shopping: 'shopping',
        accommodations: 'stay',
        play: 'play',
        events: 'events',
        visiting: 'visiting',
        map: 'map',
        chat: 'chat',
        full_site: 'full site',
        french_site: 'site français',
        city_news: 'city news',
        close: 'close'
    },

    places:{
        thingstodo_title: 'Things To Do',
        dining_title: 'Dining',
        shopping_title: 'Shopping',
        favourites_title: 'My Favourites',

        accommodations_title: 'Accommodations',
        accommodations_bookroom: 'book a room',
        accommodations_checkin: 'check-in',
        accommodations_checkout: 'check-out',
        accommodations_type: 'type',
        accommodations_lodging: 'All Lodging',
        accommodations_hotel: 'Hotels, Motels, Resorts',
        accommodations_inn: 'Inns',
        accommodations_bb: 'Bed & Breakfasts',
        accommodations_hunting: 'Fishing and Hunting',
        accommodations_cottage: 'Cottages/Vacation Homes',  

        events_title: 'events',
        events_to: 'To',
        events_from: 'From',
        events_all: 'All Dates',
        events_range: 'Select Date Range',
        events_calendar: 'Add to my calendar',
        visiting_title: 'visiting saint john',
        map_title: 'map',

        get_directions: 'Get Directions',
        explore_nearby: 'Explore Nearby',
        tel: 'Tel',
        toll_free: 'Toll Free',
        email: 'Email',
        year_round: 'Year-round',
        open: 'Open',
        price_range: 'Price Range',
        accepted_payment_methods: 'Accepted Payment Methods',

        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',

        all_types:'All Types',
        all_areas:'All Areas',
        sort_by:'Sort by',
        popularity:'Popularity',
        alphabetical:'Alphabetical'
    },
    search: 'search',
    go: 'go',
    selection: 'make another selection',
    location: 'Location',
    zero_results: 'We\'re sorry but there doesn\'t appear to be anything available.',
    none: 'No',
    all: 'All',
    initializing:'Please wait while initializing map data...'
    });
 })();

 (function(){
    var uiI18n = angular.module('ui.i18n');
    uiI18n.add("fr",{

    nav:{
        thingstodo: 'activités',
        dining: 'resturants',
        shopping: 'magasinage',
        accommodations: 'rester',
        play: 'jouer',
        events: 'événements',
        visiting: 'visite',
        map: 'carte',
        chat: 'bavarder',
        full_site: 'site complet',
        french_site: 'english site',
        city_news: 'ville nouvelles',
        close: 'fermer'
    },
    places:{
        thingstodo_title: 'Activités',
        dining_title: 'Resturants',
        shopping_title: 'Magasinage',
        favourites_title: 'Mes Favoris',

        accommodations_title: 'Hébergement',
        accommodations_bookroom: 'réserver une chambre',
        accommodations_checkin: 'enregistrement',
        accommodations_checkout: 'départ',
        accommodations_type: 'type',
        accommodations_lodging: 'Tous',
        accommodations_hotel: 'Hotels, Motels, Villegiatures',
        accommodations_inn: 'Auberges',
        accommodations_bb: 'Gites du Voyageur',
        accommodations_hunting: 'Chasse et Peche',
        accommodations_cottage: 'Chalets/Residence de Vacances',    

        events_title: 'événements',
        events_to: 'À',
        events_from: 'De/À',
        events_all: 'Toutes Les Dates',
        events_range: 'Choisir La Période',
        events_calendar: 'Inscrire au calendrier',
        visiting_title: 'visite',
        map_title: 'carte',

        get_directions: 'Obtenez L\'itnéraire',
        explore_nearby: 'Explorez Les Environs',
        tel: 'Tél',
        toll_free: 'Toll Free',
        email: 'Courriel',
        year_round: 'À l\'année longue',
        open: 'Ouvert',
        price_range: 'Gamme de prix',
        accepted_payment_methods: 'Modes de paiement acceptés',

        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche',

        all_types:'Toutes les types',
        all_areas:'Toutes les régions',
        sort_by:'Ordre de tri',
        popularity:'Popularité',
        alphabetical:'Alphabétique'

    },
    search: 'rechercher',
    go: 'aller',
    selection: 'faire une autre sélection',
    location: 'Endroit',
    zero_results: 'Nous sommes désolés, mais il ne semble pas y avoir de disponible.',
    none: 'aucun',
    all: 'tous',
    initializing: 'S\'il vous plaît patienter pendant l\'initialisation des données de la carte ...'
    });
 })();
