angular.module('dsjmobile.controllers', [])
/*------------------------------------+
| LOCALIZATION for switching language |
+------------------------------------*/
.controller('lang', function($scope, $rootScope, $stateParams, $cookies, $ionicViewService, $ionicSideMenuDelegate){
  if(!$cookies.language){
    $cookies.language = "en";
    $rootScope.language = $cookies.language;
  }else if(!$rootScope.language){
    $rootScope.language = $cookies.language;
  }

  $rootScope.changeLanguage = function(lang){
    if(lang == undefined){
      $cookies.language = $cookies.language == "fr" ? "en" : "fr";
      $rootScope.language = $cookies.language;
    }else if(lang == 'en'){
      $cookies.language = 'en';
      $rootScope.language = $cookies.language;
    }else if(lang == 'fr'){
      $cookies.language = 'fr';
      $rootScope.language = $cookies.language;
    }
    $ionicViewService.clearHistory();
  }
  
  $scope.toggleMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }

})
.controller('loadDataCtrl', function($scope, $rootScope, $stateParams, $cookies, $ionicViewService, $ionicSideMenuDelegate,ThingstodoService, AreaService,DiningService,ShoppingService,EventsService,AccomService,VisitingService){
 	
/*	if(!window.localStorage.getItem("localdb"))
	{
            DBCopy.copyFile(function(){
                            window.localStorage.setItem("localdb","1");
                            db = openDatabase('mydb', '1.0', 'dsj', 5 * 1024 * 1024);
                            },function(){
                            init_();
                            AreaService.areas(function(res){});
                            setTimeout(function(){
                                       ThingstodoService.types('',function(res){});
                                       AccomService.types('',function(res){});
                                       DiningService.types('',function(res){});
                                       ShoppingService.types('',function(res){});
                                       EventsService.types(function(res){});
                                       },0);
                            setTimeout(function(){
                                       ThingstodoService.all(function(res){});
                                       ShoppingService.all(function(res){});
                                       DiningService.all(function(res){});
                                       EventsService.all(function(res){});
                                       VisitingService.all(function(res){});
                            },1);

                            },"dsj");
			
	
    }*/
            AreaService.areas(function(res){});
            setTimeout(function(){
                       ThingstodoService.types('',function(res){});
                       AccomService.types('',function(res){});
                       DiningService.types('',function(res){});
                       ShoppingService.types('',function(res){});
                       EventsService.types(function(res){});
                       },0);
            setTimeout(function(){
                       ThingstodoService.all(function(res){});
                       ShoppingService.all(function(res){});
                       DiningService.all(function(res){});
                       EventsService.all(function(res){});
                       VisitingService.all(function(res){});
                       },1)
})

/*---------------------+
| MODAL POPUP FOR PLAY |
+---------------------*/// embedded single youtube video
.controller('play', function($scope, $ionicModal) {
	console.log("14");
  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('modal-play.html', function(modal) {  $scope.modal = modal; },
  {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
})

/*-------------+
| THINGS TO DO |
+-------------*/
.controller('ThingsToDoDataIndex', function($scope, $ionicLoading, $ionicScrollDelegate, $rootScope, ThingstodoService, AreaService) {
	console.log("14");
    $scope.currentparams = ThingstodoService.currentparams();
     ThingstodoService.types('',function(res){
		 $scope.placetypes=res;
	  });
     AreaService.areas(function(res){
		$scope.areas = res;
	 });
    ThingstodoService.all(function(res){
		
		$scope.places=res;
	});
	
    if ($scope.currentparams != "") {
        var newobject = JSON.parse($scope.currentparams);
        for (var j = 0; j < newobject.length; j++) {
            $scope.param_type = newobject[j].type;
            $scope.param_area = newobject[j].area;
            $scope.param_sort = newobject[j].sort;
        }
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        if(document.getElementById("selectopts")){
          document.getElementById("selectopts").className = "rollup";
        }
    }else{
      $scope.param_sort = "p";
    }
    
    console.log("current params: "+$scope.currentparams);
  
  //change the visibility of the search elements  
  $scope.showfilter = function(click){
      if(click == 'bar'){
        document.getElementById("selectbar").className = "bar bar-header makeselection hide";
        document.getElementById("selectopts").className = "";
        document.getElementById("shopping").firstChild.style.margin = "0px 0px 0px 0px"; //remove any margin
        $ionicScrollDelegate.scrollTop();
      }else if(click == 'res'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        document.getElementById("selectopts").className = "rollup";
        $ionicScrollDelegate.scrollTop();
        //document.getElementById("shopping").firstChild.style.margin = "40px 0px 0px 0px"; //give us a margin
      }else if(click == 'prev'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        //document.getElementById("shopping").firstChild.style.margin = "40px 0px 0px 0px"; //give us a margin
        //document.getElementById("selectopts").className = "rollup";
      }
  }

  $scope.filterResults = function(param_type, param_area, param_sort) {
    if(param_type == null){ param_type = "";} 
    if(param_area == null){ param_area = "";}
    if(param_sort == null){ param_sort = "";}

    //console.log('clicked go with {'+param_area+'} and {'+param_type+'} with sorting{'+param_sort+'}');
    ThingstodoService.filtered(function(res){
		$scope.places=res;
		},param_type, param_area, param_sort); //need to send param1 and param2
  };  

})

.controller('ThingsToDoDataDetail', function($scope, $stateParams, ThingstodoService) {
	
ThingstodoService.get($stateParams.thingId,'existing',function(res){
	$scope.place=res;
	//initialize();
		});
	ThingstodoService.checkFavourite($stateParams.thingId,function(res){
		
		$scope.favourite=res;
	});
	$scope.addFav=function(){
		$scope.favourite='YES';
		ThingstodoService.updatefavourite('add',$stateParams.thingId,function(res){
			$scope.favourite=res;
			})
		}
		
	$scope.removeFav=function(){
		$scope.favourite='NO';
		ThingstodoService.updatefavourite('remove',$stateParams.thingId,function(res){
			$scope.favourite=res;
			})
		}
    function initialize() {
      var LatLng = new google.maps.LatLng($scope.place.latitude,$scope.place.longitude);
      var mapOptions = {
        center: LatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        streetViewControl: false,
        zoomControl: false
      };
      var map = new google.maps.Map(document.getElementById("map_canvas"),
          mapOptions);
      var marker = new google.maps.Marker({
          position: LatLng,
          map: map
        });
      $scope.map = map;
    }
   if(google)
    google.maps.event.addDomListener(window, 'load', initialize);

    
     
})

/*-------+
| DINING |
+-------*/
.controller('DiningDataIndex', function($scope, $ionicLoading, $ionicScrollDelegate, DiningService, AreaService) {

    $scope.currentparams = DiningService.currentparams();
	DiningService.types('',function(res){
		 $scope.placetypes=res;
	  });
     AreaService.areas(function(res){
		$scope.areas = res;
	 });
    DiningService.all(function(res){
		
		$scope.places=res;
	});
	

    if ($scope.currentparams != "") {
        var newobject = JSON.parse($scope.currentparams);
        for (var j = 0; j < newobject.length; j++) {
            $scope.param_type = newobject[j].type;
            $scope.param_area = newobject[j].area;
            $scope.param_sort = newobject[j].sort;
        }
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        if(document.getElementById("selectopts")){
          document.getElementById("selectopts").className = "rollup";
        }
    }else{
      $scope.param_sort = "p";
    }
    
    
  
  //change the visibility of the search elements  
  $scope.showfilter = function(click){
      if(click == 'bar'){
        document.getElementById("selectbar").className = "bar bar-header makeselection hide";
        document.getElementById("selectopts").className = "";
        document.getElementById("shopping").firstChild.style.margin = "0px 0px 0px 0px"; //remove any margin
        $ionicScrollDelegate.scrollTop();
      }else if(click == 'res'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        document.getElementById("selectopts").className = "rollup";
        $ionicScrollDelegate.scrollTop();
      }else if(click == 'prev'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
      }
  }

  $scope.filterResults = function(param_type, param_area, param_sort) {
    if(param_area == null){ param_area = "";}
    if(param_type == null){ param_type = "";} 
    if(param_sort == null){ param_sort = "";}

    //console.log('clicked go with {'+param_area+'} and {'+param_type+'} with sorting{'+param_sort+'}');
     DiningService.filtered(function(res){
		$scope.places=res;
		},param_type, param_area, param_sort); //need to send param1 and param2
  }; 
})
.controller('DiningDataDetail', function($scope, $stateParams, DiningService) {
	
DiningService.get($stateParams.diningId, 'existing',function(res){
	
	$scope.place=res;
	//initialize();
		});
	DiningService.checkFavourite($stateParams.diningId,function(res){
		
		$scope.favourite=res;
	});
	$scope.addFav=function(){
		$scope.favourite='YES';
		DiningService.updatefavourite('add',$stateParams.diningId,function(res){
			$scope.favourite=res;
			})
		}
		
	$scope.removeFav=function(){
		$scope.favourite='NO';
		DiningService.updatefavourite('remove',$stateParams.diningId,function(res){
			$scope.favourite=res;
			})
		}
   
    function initialize() {
      var LatLng = new google.maps.LatLng($scope.place.latitude,$scope.place.longitude);
      var mapOptions = {
        center: LatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        streetViewControl: false,
        zoomControl: false
      };
      var map = new google.maps.Map(document.getElementById("map_canvas"),
          mapOptions);
      var marker = new google.maps.Marker({
          position: LatLng,
          map: map
        });
      $scope.map = map;
    }
	if(google)
    google.maps.event.addDomListener(window, 'load', initialize); 

    
})
/*---------+
| SHOPPING |
+---------*/
.controller('ShoppingDataIndex', function($scope, $ionicLoading, $ionicScrollDelegate, ShoppingService, AreaService) {
	
  $scope.scroll = 0;
  $scope.currentparams = ShoppingService.currentparams();

  ShoppingService.types('',function(res){
		 $scope.placetypes=res;
	  });
     AreaService.areas(function(res){
		$scope.areas = res;
	 });
    ShoppingService.all(function(res){
		
		$scope.places=res;
	});
  if ($scope.currentparams != "") {
      var newobject = JSON.parse($scope.currentparams);
      for (var j = 0; j < newobject.length; j++) {
          $scope.param_type = newobject[j].type;
          $scope.param_area = newobject[j].area;
          $scope.param_sort = newobject[j].sort;
      }
      document.getElementById("selectbar").className = "bar bar-header makeselection";
      if(document.getElementById("selectopts")){
        document.getElementById("selectopts").className = "rollup";
      }
  }else{
    $scope.param_sort = "p";
  }
  

  
  //change the visibility of the search elements  
  $scope.showfilter = function(click){
      if(click == 'bar'){
        document.getElementById("selectbar").className = "bar bar-header makeselection hide";
        document.getElementById("selectopts").className = "";
        document.getElementById("shopping").firstChild.style.margin = "0px 0px 0px 0px"; //remove any margin
        $ionicScrollDelegate.scrollTop();
      }else if(click == 'res'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        document.getElementById("selectopts").className = "rollup";
        $ionicScrollDelegate.scrollTop();
      }else if(click == 'prev'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
      }
  }

  $scope.filterResults = function(param_type, param_area, param_sort) {
    if(param_area == null){ param_area = "";}
    if(param_type == null){ param_type = "";} 
    if(param_sort == null){ param_sort = "";}

    //console.log('clicked go with {'+param_area+'} and {'+param_type+'} with sorting{'+param_sort+'}');
     ShoppingService.filtered(function(res){
		 $scope.places=res;
		 },param_type, param_area, param_sort); //need to send param1 and param2
  }; 
})
.controller('ShoppingDataDetail', function($scope, $stateParams, ShoppingService) {

    ShoppingService.get($stateParams.shopId, 'existing',function(res){
	$scope.place=res;
	//initialize();
		});
 ShoppingService.checkFavourite($stateParams.shopId,function(res){
		
		$scope.favourite=res;
	});
	$scope.addFav=function(){
		$scope.favourite='YES';
		ShoppingService.updatefavourite('add',$stateParams.shopId,function(res){
			$scope.favourite=res;
			})
		}
		
	$scope.removeFav=function(){
		$scope.favourite='NO';
		ShoppingService.updatefavourite('remove',$stateParams.shopId,function(res){
			$scope.favourite=res;
			})
		}
    function initialize() {
		if(google)
		{
      var LatLng = new google.maps.LatLng($scope.place.latitude,$scope.place.longitude);
      var mapOptions = {
        center: LatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        streetViewControl: false,
        zoomControl: false
      };
      var map = new google.maps.Map(document.getElementById("map_canvas"),
          mapOptions);
      var marker = new google.maps.Marker({
          position: LatLng,
          map: map
        });
      $scope.map = map;
    }
	}
	
   if(google)
    google.maps.event.addDomListener(window, 'load', initialize);     

   
})
/*-------+
| EVENTS |
+-------*/
.controller('EventsDataIndex', function($scope, $ionicLoading, $ionicScrollDelegate, EventsService, AreaService) {

    $scope.currentparams = EventsService.currentparams();
    EventsService.types(function(res){
		$scope.placetypes=res;
		});
    AreaService.areas(function(res){
		$scope.areas = res;
		});
     EventsService.all(function(res){
		 $scope.places=res;
		 });

  if ($scope.currentparams != "") {
      var newobject = JSON.parse($scope.currentparams);
      for (var j = 0; j < newobject.length; j++) {
          $scope.param_type = newobject[j].type;
          $scope.param_area = newobject[j].area;
          $scope.start_date = newobject[j].from_date;
          $scope.end_date = newobject[j].to_date;

          if(newobject[j].from_date == "" || newobject[j].to_date == ""){//if there are from/to dates set it's likely range.
            $scope.param_daterange = "all";
          }else{
            $scope.param_daterange = "range";
          }
      }
      document.getElementById("selectbar").className = "bar bar-header makeselection";
      if(document.getElementById("selectopts")){
        document.getElementById("selectopts").className = "rollup";
      }
  }else{
    $scope.param_daterange = "all";
  }
  


  /* DATE STUFF */
  $scope.processed_start_date = moment().format("YYYY-MM-DD");
  $scope.processed_end_date = moment().add('days', 1).format("YYYY-MM-DD");

  $scope.datechange = function(){
    //ok so once we start changing the info we need to see if it's valid
    if (moment($scope.start_date).isValid()){
      $scope.processed_start_date = moment($scope.start_date).format("YYYY-MM-DD");
    }
    if (moment($scope.end_date).isValid()){
      $scope.processed_end_date = moment($scope.end_date).format("YYYY-MM-DD");
    }
  }
  
  //change the visibility of the search elements  
  $scope.showfilter = function(click){
      if(click == 'bar'){
        document.getElementById("selectbar").className = "bar bar-header makeselection hide";
        document.getElementById("selectopts").className = "";
        document.getElementById("events").firstChild.style.margin = "0px 0px 0px 0px"; //remove any margin
        $ionicScrollDelegate.scrollTop();
      }else if(click == 'res'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        document.getElementById("selectopts").className = "rollup";
        $ionicScrollDelegate.scrollTop();
      }else if(click == 'prev'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
      }
  }

  $scope.filterResults = function(param_type, param_area, param_daterange, param_start_date, param_end_date) {
    if(param_type == null){ param_type = "";} 
    if(param_area == null){ param_area = "";}

    if(param_start_date == null){ param_start_date = "" }
    if(param_end_date == null){ param_end_date = "" }

    if(param_daterange == null){ param_daterange = "all"; } //vs "range"

    if(param_daterange == "range"){
      //provide from/to dates


    }else{//not a range so don't send the dates
      param_start_date = "";
      param_end_date = "";
    }

    console.log('clicked go with {'+param_area+'} and {'+param_type+'} with from date {'+param_start_date+'} and to date {'+param_end_date+'} with range {'+param_daterange+'}');
     EventsService.filtered(function(res){
		$scope.places=res;
		},param_type, param_area, param_daterange, param_start_date, param_end_date); //need to send param1 and param2
  }

/* GENERATE ICAL LINK */
// TODO: not working/not complete (perhaps this should be a directive of a filter?)
/*$scope.generateiCal = function(start_date, start_time, end_date, end_time, event_title) {
    start_date = moment(start_date, "YYYY-MM-DD").format("YYYYMMDD"); //Ymd 20141231
    //var start_time; //His 235959
    end_date = moment(end_date, "YYYY-MM-DD").format("YYYYMMDD"); //Ymd
    //var end_time; //His

    if(start_time){
        // should ouput 7:00 PM to 150000 (should be noted the original ical added 3 hours to this time, not sure why... yet)
        start_time = moment(start_time, "h:mm A").format("HHmmss");
    }else{
        start_time = "120000";
    }
    if(end_time){
        end_time = moment(end_time, "h:mm A").format("HHmmss");
    }else{
        end_time = "120000";
    }

    //get and format the current time
    var curtime = moment();
    var gm_date = moment(curtime).format("YYYYMMDD");
    var gm_time = moment(curtime).format("HHmmss");

    var icalMSG = "BEGIN:VCALENDAR\r\n"+
    "VERSION:2.0\r\n"+
    "PRODID:-//Discover Saint John//NONSGML Events //EN\r\n"+
    "BEGIN:VEVENT\r\n"+
    "DTSTAMP:"+gm_date+'T'+gm_time+"Z\r\n"+
    "DTSTART:"+start_date+"T"+start_time+"Z\r\n"+
    "DTEND:"+end_date+"T"+end_time+"Z\r\n"+
    "SUMMARY:"+event_title+"\r\n"+
    "END:VEVENT\r\n"+
    "END:VCALENDAR";

    window.open( "data:text/calendar;charset=utf8," + escape(icalMSG));
}*/

})

.controller('EventsDataDetail', function($scope, $stateParams, EventsService) {
	console.log("7");
    EventsService.get($stateParams.eventId,function(res){
	$scope.place=res;
	//initialize();
		});
  EventsService.checkFavourite($stateParams.eventId,function(res){
		
		$scope.favourite=res;
	});
	$scope.addFav=function(){
		$scope.favourite='YES';
		EventsService.updatefavourite('add',$stateParams.eventId,function(res){
			$scope.favourite=res;
			})
		}
		
	$scope.removeFav=function(){
		$scope.favourite='NO';
		EventsService.updatefavourite('remove',$stateParams.thingId,function(res){
			$scope.favourite=res;
			})
		}
 
  // MAP
  function initialize() {
    var address = ""+$scope.place.event_street+" "+$scope.place.event_street2+" "+$scope.place.event_city+" "+$scope.place.event_postal_code+" "+$scope.place.event_province+"";

    var mapOptions = {
      center: new google.maps.LatLng(45.2819976,-66.0532528), //default to saint john coords
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      streetViewControl: false,
      zoomControl: false
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);
    
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        "address": address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location, 14);
          var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map
          });
        }
      });
    $scope.map = map;
  }
 if(google)
  google.maps.event.addDomListener(window, 'load', initialize);  
   
  // end MAP

})

/*---------+
| VISITING |
+---------*/
.controller('VisitingPageCtrl', function($scope, $ionicLoading, VisitingService) {
	console.log("8");
    // $scope.loading = $ionicLoading.show({
    //   content: 'Loading...',
    //   animation: 'fade-in',
    //   showBackdrop: false
    // })

    // VisitingService.all().then(function(response){
    //   $scope.visit = response;
    //   $scope.loading.hide();
    // })
     VisitingService.all(function(res){
	$scope.visit=res;
		});
    $scope.isCollapsed = true;
})

/*--------+
| MAP API |
+--------*/
.controller('MapCtrl', function($scope, $ionicLoading, $stateParams, $rootScope, ThingstodoService, DiningService, ShoppingService, AccomService, MapService) { 
  //grab the types to populate the select options
  if(!$scope.thingtypes || !$scope.accomtypes || !$scope.diningtypes || !$scope.shoptypes){
    ThingstodoService.types('onmap',function(res){
	$scope.thingtypes=res;	
		});
    AccomService.types('onmap',function(res){
	$scope.accomtypes = res;	
		});
    DiningService.types('onmap',function(res){
	$scope.diningtypes=res;	
		});
    ShoppingService.types('onmap',function(res){
	$scope.shoptypes=res;	
		});
  }

  //change the visibility of the search elements
  $scope.showfilter = function(click){
      if(click == 'bar'){
        document.getElementById("selectbar").className = "bar bar-header makeselection hide";
        document.getElementById("selectopts").className = "scroll-content";
      }else if(click == 'res'){
        document.getElementById("selectbar").className = "bar bar-header makeselection";
        document.getElementById("selectopts").className = "scroll-content hide";
      }
  }

$scope.filterResults = function(param_thingtype, param_accomtype, param_diningtype, param_shoptype, placelat, placelong){
  if(param_thingtype == undefined){ param_thingtype = ""; }
  if(param_accomtype == undefined){ param_accomtype = ""; }
  if(param_diningtype == undefined){ param_diningtype = ""; }
  if(param_shoptype == undefined){ param_shoptype = ""; }
  
  if(placelat && placelong){
    param_thingtype = "all"; 
    param_accomtype = "all"; 
    param_diningtype = "all"; 
    param_shoptype = "all";
  }

  var infos = [];
  var markerClusterer = null;

   function closeInfos(){
     if(infos.length > 0){
        /* detach the info-window from the marker */
        infos[0].set("marker",null);
        /* and close it */
        infos[0].close();
        /* blank the array */
        infos.length = 0;
     }
    }

    function initialize(data, placelat, placelong) {

      if(!placelat && !placelong){
        placelat = "45.2819976";
        placelong = "-66.0532528";
        var myzoom = 10;
      }else{
        var nearby = true;
        var myzoom = 20;
        var cityCircle;
      }

      var mapOptions = {
        center: new google.maps.LatLng(placelat,placelong),
        zoom: myzoom,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        scaleControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"),
          mapOptions);

      var noPointOfInterest = [ //disable the points of interest
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ];
      map.setOptions({styles: noPointOfInterest});

      var bounds = new google.maps.LatLngBounds();
      var markers = []
      var center_marker;

      for (var i = 0; i < data.length; i++) {
          var dataListing = data[i];
          var latLng = new google.maps.LatLng(dataListing.latitude, dataListing.longitude);
          var marker = new google.maps.Marker({
            position: latLng,
            icon: dataListing.icon,
            title: dataListing.title,
            content: dataListing.content
          });
          
          google.maps.event.addListener(marker, 'click', function() {         
            /* close the previous info-window */
            closeInfos();

            var boxText = '<div class="infobox-content clearafter">' + this.content + 
                          '</div><div class="arrow-wrap"><div class="arrow-border"></div><div class="arrow-fill"></div></div>';
            
            var myOptions = {
                    content: boxText,
                    alignBottom: true,
                    disableAutoPan: false,
                    maxWidth: 0,
                    pixelOffset: new google.maps.Size(-175, -30),
                    zIndex: null,
                    boxStyle: { 
                      background: "#fff",
                      opacity: 1,
                      width: "80%"
                     },
                    closeBoxMargin: "8px",
                    closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
                    infoBoxClearance: new google.maps.Size(50, 50),
                    isHidden: false,
                    pane: "floatPane",
                    enableEventPropagation: true
            };
            
            
            /* the marker's content gets attached to the info-window: */
            //var info = new google.maps.InfoWindow({content: this.content});
            var info = new InfoBox(myOptions);
            
            /* trigger the infobox's open function */
            info.open(map,this);
            
            /* keep the handle, in order to close it on next click event */
            infos[0] = info;
           
          });
        
          bounds.extend(latLng);
          markers.push(marker);
          
          //TODO: This part is broken.                
          /*var cid = parseInt(dsj_place_map_scripts_vars.center_id, 10);
          if ($.inArray(cid, dataListing.id) > -1)
            center_marker = i;*/
          
        }

        var styles = [
          {
            url: 'http://discoversaintjohn.com/cms/wp-content/themes/saintjohn/images/round_map_icon_30.png',
            height: 30,
            width: 30,
            textColor: '#ffffff',
            textSize: 10
          }, {
            url: 'http://discoversaintjohn.com/cms/wp-content/themes/saintjohn/images/round_map_icon_40.png',
            height: 40,
            width: 40,
            textColor: '#ffffff',
            textSize: 11
          }, {
            url: 'http://discoversaintjohn.com/cms/wp-content/themes/saintjohn/images/round_map_icon_50.png',
            height: 50,
            width: 50,
            textColor: '#ffffff',
            textSize: 12
          }
        ];
        
        markerCluster = new MarkerClusterer(map, markers, {
          maxZoom: 16,
          gridSize: 30,
          styles: styles
        });

      if(nearby){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(placelat,placelong),
            animation: google.maps.Animation.DROP,
            clickable: false,
            map: map
          });
        marker.setAnimation(google.maps.Animation.BOUNCE);
        /*var circleoptions = {
          strokeColor: '#FF0000',
          strokeOpacity: 0.35,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: new google.maps.LatLng(placelat,placelong),
          radius: 10
        };
        circle = new google.maps.Circle(circleoptions);*/
      }

      // Stop the side bar from dragging when mousedown/tapdown on the map
      google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
        e.preventDefault();
        return false;
      });
      $scope.map = map;
    }//end initialize(data)
   
    google.maps.event.addDomListener(window, 'load', initialize); 

    $scope.centerOnMe = function() {
      if(!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(pos) {
        if($scope.mylocation != undefined){//remove the previous location dot if set
          $scope.mylocation.setMap(null);
        } 

        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.map.setZoom(16);
        
        var image = 'http://i.stack.imgur.com/orZ4x.png';
        var mylocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: $scope.map,
                icon: image
            });
        $scope.mylocation = mylocation; //set the scope location for us to remove later.
        mylocation.setMap($scope.map);

        $scope.loading.hide();

      }, function(error) {
        alert('Unable to get location: ' + error.message);
      });
    };

  MapService.filtered(param_thingtype, param_accomtype, param_diningtype, param_shoptype).then(function(result){
    var data = result.data.maps;
    initialize(data, placelat, placelong);
  });

}//end scope filter function

  if(!$scope.currentparams){
    $scope.currentparams = MapService.currentparams();
  }
  
  //parse the current passed params
  if ($scope.currentparams != "" || ($stateParams.placelat && $stateParams.placelong)) {
    if($stateParams.placelat != undefined){ var placelat = $stateParams.placelat; $scope.isnearby = true; }else{ var placelat = null; }
    if($stateParams.placelong != undefined){ var placelong = $stateParams.placelong; }else{ var placelong = null; }

    if($scope.currentparams != ""){
      var newobject = JSON.parse($scope.currentparams);
        for (var j = 0; j < newobject.length; j++) {
          $scope.param_thingtype = newobject[j].thingstodo;
          $scope.param_accomtype = newobject[j].accommodations;
          $scope.param_diningtype = newobject[j].dining;
          $scope.param_shoptype  = newobject[j].shopping;
        }
    }
      if(placelat && placelong){
        document.getElementById("selectbar").className = "bar bar-header makeselection hide";
      }else{
        document.getElementById("selectbar").className = "bar bar-header makeselection";
      }
      if(document.getElementById("selectopts")){
        document.getElementById("selectopts").className = "rollup hide";
      }
      $scope.filterResults(null, null, null, null, placelat, placelong);
  }

})

/*---------------------------+
| ACCOMMODATIONS DATE PICKER |
+---------------------------*/
.controller('accomCtrl', function($scope, $rootScope){
	console.log("9");
  //set some default dates to today's date. (I believe this would count as a change)
  if($rootScope.language == 'fr'){
    $scope.processed_start_date = moment().format("DD/MM/YYYY");
    $scope.processed_end_date = moment().add('days', 1).format("DD/MM/YYYY");
  }else{
    $scope.processed_start_date = moment().format("MM/DD/YYYY");
    $scope.processed_end_date = moment().add('days', 1).format("MM/DD/YYYY");
  }

  $scope.processed_nights = "1";
  $scope.processed_start_day = moment().format("DD");
  $scope.processed_start_month = moment().format("MM");
  $scope.processed_start_year = moment().format("YYYY");

  $scope.datechange = function(){
    //ok so once we start changing the info we need to see if it's valid
    if (moment($scope.start_date).isValid()){
      if($rootScope.language == 'fr'){
        $scope.processed_start_date = moment($scope.start_date).format("DD/MM/YYYY");
      }else{
        $scope.processed_start_date = moment($scope.start_date).format("MM/DD/YYYY");
      }

      $scope.processed_start_day = moment($scope.start_date).format("DD");
      $scope.processed_start_month = moment($scope.start_date).format("MM");
      $scope.processed_start_year = moment($scope.start_date).format("YYYY");
    }
    if (moment($scope.end_date).isValid()){
      if($rootScope.language == 'fr'){
        $scope.processed_end_date = moment($scope.end_date).format("DD/MM/YYYY");
        $scope.processed_nights = moment($scope.processed_end_date,"DD/MM/YYYY").diff(moment($scope.processed_start_date,"DD/MM/YYYY"), 'days');
      }else{
        $scope.processed_end_date = moment($scope.end_date).format("MM/DD/YYYY");
        $scope.processed_nights = moment($scope.processed_end_date,"MM/DD/YYYY").diff(moment($scope.processed_start_date,"MM/DD/YYYY"), 'days');
      }
    }
  }

  $scope.submitJack = function(click){
    if(click == 'search'){
      //make an element visible
      document.getElementById("confirmation").className = "";
    }else if(click == 'cancel'){
      //cancel makes it go away
      document.getElementById("confirmation").className = "hide";
    }else if(click =='ok'){
      document.getElementById('widget_booking_form').submit();
    }
  }

})

.controller('AccommodationDetail', function($scope, $stateParams, AccomService) {
	console.log("10");
   AccomService.get($stateParams.accomId, 'existing',function(res){
	$scope.place=res;
	//initialize();
		});
  
    function initialize() {
      var LatLng = new google.maps.LatLng($scope.place.latitude,$scope.place.longitude);
      var mapOptions = {
        center: LatLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        streetViewControl: false,
        zoomControl: false
      };
      var map = new google.maps.Map(document.getElementById("map_canvas"),
          mapOptions);
      var marker = new google.maps.Marker({
          position: LatLng,
          map: map
        });
      $scope.map = map;
    }
   if(google)
    google.maps.event.addDomListener(window, 'load', initialize);

    
})






.controller('DatepickerStartCtrl', function($scope) {
	console.log("11");
  $scope.today = function() {
    $scope.start_date = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.start_date = null;
  };

  // Disable weekend selection
  // $scope.disabled = function(date, mode) {
  //   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  // };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yyyy'",
    'starting-day': 0
  };

  $scope.formats = ['MM/dd/yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
})


.controller('DatepickerEndCtrl', function($scope) {
	console.log("12");
  $scope.today = function() {
    $scope.end_date = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.end_date = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    console.log($event);
    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yyyy'",
    'starting-day': 0
  };

  $scope.formats = ['MM/dd/yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.format = $scope.formats[0];
})

; // need this little guy here at the end.