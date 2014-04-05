angular.module('dsjmobile.services', [])
/*
    DSJ-API KEY: 0x0C101B162C7011E29B5976846188709B 
    example: http://discoversaintjohn.com/api/events/directory/?token=0x0C101B162C7011E29B5976846188709B&lang=en
*/

/*--------------+
| AREAS SERVICE |
+--------------*///grab the areas which are shared among all
.factory('AreaService', function($http, $rootScope){
  var language = $rootScope.language;
  // GET THE AREAS TAXONOMY
  var areas =[];

  var getareas = function(callback){
	  
   //if(language != $rootScope.language){
      
      getRecords('areas','',[],$rootScope.language,function(res){
		  
		  areas=res;

		  if(areas.length <= 0){
			  areas=[];
    			$http.get('http://discoversaintjohn.com/api/taxonomy/areas/?token=0x0C101B162C7011E29B5976846188709B&lang='+$rootScope.language+'')
      .success(function(data, status, headers, config){ console.log(status+' areas [shared] ('+$rootScope.language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' areas [shared] ('+$rootScope.language+')'); })
      .then(function(response){    
	   
        						var jsonData = response.data.areas;
        						var jsonKeys = Object.keys(jsonData);
        						for (var i = 0; i < jsonKeys.length; i++) 
								{
          							var jsonSingle = jsonData[jsonKeys[i]];
		  							insertRecord(jsonSingle,"areas","",[],$rootScope.language);
          							areas.push(jsonSingle);
        						}
		
      					})
	  
  					}
  				callback(areas);
			});
	  
    	//}
     
	}

  return {
    areas: function(callback){
      return getareas(callback);
    }
  }
})

/*--------------+
| ACCOM SERVICE |
+--------------*///grab the lodging types for stay/accommodations
.factory('AccomService', function($http, $rootScope, $q){
  var language = $rootScope.language;
  // GET THE TYPES TAXONOMY
  var placetypes =[];
  var flts = [];

  var getplacetypes = function(onmap,callback){
  if(language != $rootScope.language){
      placetypes = [];
    }

    placetypes = []; //reset the placetypes to re-fetch EVERY time...
getRecords('placetypes','accommodations',[],$rootScope.language,function(res){
		placetypes=res;

		if(onmap == "onmap"){
        var inject = new Object();        
        if($rootScope.language == 'fr'){
          inject.name = "Tous les Hébergement";
        }else if($rootScope.language == 'en'){
          inject.name = "All Accommodations";
        }
        inject.slug = "all";
        inject.term_id = "";
        placetypes.push(inject);
    }
	 
    
    

  if(placetypes.length <= 0){
  $http.get('http://discoversaintjohn.com/api/accommodations/types/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'')
    .success(function(data, status, headers, config){ console.log(status+' types [accom] ('+language+')'); })
    .error(function(data, status, headers, config){ console.log(status+' types [accom] ('+language+')'); })
    .then(function(response){      
      var jsonData = response.data.types;
      var jsonKeys = Object.keys(jsonData);

      for (var i = 0; i < jsonKeys.length; i++) {
        var jsonSingle = jsonData[jsonKeys[i]];
		insertRecord(jsonSingle,"placetypes","accommodations",[],language);
        placetypes.push(jsonSingle);
      }
    })

        }
    
   callback(placetypes);
	});

  }

  //promise for individual result
  var getSingle = function(postid,callback){
	  
	  getSingleRecord(postid,function(res){
		 
		  if(res.length<=0)
		  {
    url = 'http://discoversaintjohn.com/api/accommodations/profile/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&id='+postid+'';


    
    var getdata = $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .then(function(response){ return response; })

    var defer = $q.defer();
    defer.resolve(getdata);
    callback(defer.promise);
		  }
		  else
		  {
			  callback(res);
			}
	  });
  }

  return {
    types: function(onmap,callback){
      return getplacetypes(onmap,callback);
    },
    get: function(placeId, existing,callback) { 
        
          return getSingle(placeId,callback);
               
    }
  }
})

/*---------------------+
| THINGS TO DO SERVICE |
+---------------------*/
.factory('ThingstodoService', function($http, $rootScope, $q) {
  var language = $rootScope.language;
  var currentparams = [];

  // GET THE TYPES TAXONOMY
  var placetypes =[];

  var getplacetypes = function(onmap,callback){
    if(language != $rootScope.language){
      placetypes = [];
    }

    placetypes = []; //reset the placetypes to re-fetch EVERY time...
	getRecords('placetypes','thingstodo',[],$rootScope.language,function(res){
		placetypes=res;

		 if(onmap == "onmap"){
        var inject = new Object();        
        if($rootScope.language == 'fr'){
          inject.name = "Tous les Activités";
        }else if($rootScope.language == 'en'){
          inject.name = "All Things To Do";
        }
        inject.slug = "all";
        inject.term_id = "";
        placetypes.push(inject);
     }//if onmap
	if(placetypes.length <= 0){
      $http.get('http://discoversaintjohn.com/api/thingstodo/types/?token=0x0C101B162C7011E29B5976846188709B&lang='+$rootScope.language+'')
        .success(function(data, status, headers, config){ console.log(status+' types [things] ('+$rootScope.language+')'); })
        .error(function(data, status, headers, config){ console.log(status+' types [things] ('+$rootScope.language+')'); })
        .then(function(response){      
          var jsonData = response.data.types;
          var jsonKeys = Object.keys(jsonData);

          for (var i = 0; i < jsonKeys.length; i++) {
            var jsonSingle = jsonData[jsonKeys[i]];
			insertRecord(jsonSingle,"placetypes","thingstodo",[],$rootScope.language);
            placetypes.push(jsonSingle);
          }
        })
    }
    
   callback(placetypes);
	});


      
  }

  // GET THE FILTERED POSTS
  var flts = []; //drop this outside of the function to make available for lodash searching and injecting into our view
  
  var filterPlaces = function(callback,type, area, sort, isFiltered){
	  
    if(!sort || sort == undefined || sort !=''){ sort = "p"; }
    var goFetch;

    if(language != $rootScope.language){
      language = $rootScope.language;
      goFetch = true; 
      flts = [];
    }

    var url = 'http://discoversaintjohn.com/api/thingstodo/directory/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&orderby='+sort+'&limitfr=0&limitto=1000';

    if(area || type){
      currentparams = [];
      currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "sort":"'+sort+'","lang":"'+language+'"}]');

      flts = []; //empty it so we're not appending (this does create a refresh/list position problem when navigating back however)
      goFetch = true;
      url = 'http://discoversaintjohn.com/api/thingstodo/filtered/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&area='+area+'&type='+type+'&orderby='+sort+'';
    }else{
      //if the flts array is already populated, it's not our first time here, so let's not push our array results.
      if(flts.length > 0){
        if(isFiltered){ //if we're trying to get a default list by submitting without area/type values.
          currentparams = []; //reset our parameters since it's a clean filter
          currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "sort":"'+sort+'"}]'); //should return empty type/area with populated sort.

          goFetch = true;
          flts = []; //reset our results.
        }else{
          goFetch = false;
		  callback(flts);
        }
      }else{
        goFetch = true;
      }
    }

    if(goFetch){
		
		getRecords('flts','thingstodo',currentparams,$rootScope.language,function(res){
			flts=res;
			if(flts.length<=0)
			{
	
		$http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' posts [things] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' posts [things] ('+language+')'); })
      .then(function(response){      
        var jsonData = response.data.thingstodo;
        var jsonKeys = Object.keys(jsonData);

        for (var i = 0; i < jsonKeys.length; i++) {
          var jsonSingle = jsonData[jsonKeys[i]];
		  insertRecord(jsonSingle,"flts","thingstodo",currentparams,language);
          flts.push(jsonSingle);
        }
	  
      })
			}
			
			callback(flts);
			});
      
	  
    }
    
  }

  //promise for individual result
  var getSingle = function(postid,callback){
	  
	  getSingleRecord(postid,function(res){
		 
		  if(res.length<=0)
		  {
    url = 'http://discoversaintjohn.com/api/thingstodo/profile/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&id='+postid+'';


    
    var getdata = $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .then(function(response){ return response; })

    var defer = $q.defer();
    defer.resolve(getdata);
    callback(defer.promise);
		  }
		  else
		  {
			  callback(res);
		  }
		  });
		  
		 
  }
	function checkFavourite(placeId,callback)
	{
		 checkFavouriteRecord(placeId,function(res){
		 callback(res);
		 });

		 
	}//checkFavourite
	function updatefavourite(option,placeId,callback)
	{
			 
		 updatefavourite(option,placeId,function(res){
		 callback(res);
		 });
	}
  return {
    all: function(callback) {
      return filterPlaces(callback);
    },
    get: function(placeId,existing,callback) { 
		return getSingle(placeId,callback);
                
    },
    types: function(onmap,callback){
      return getplacetypes(onmap,callback);
    },
    filtered: function(callback,param_type, param_area, param_sort){
      return filterPlaces(callback,param_type, param_area, param_sort, true);
    },
	checkFavourite:function(placeId,callback)
	{
		return checkFavourite(placeId,callback);
	},
	updatefavourite:function(option,placeId,callback){
		return updatefavourite(option,placeId,callback)
		},
    currentparams: function(){
      return currentparams;
    }
  }
})

/*---------------+
| DINING SERVICE |
+---------------*/
.factory('DiningService', function($http, $rootScope, $q) {
  var language = $rootScope.language;
  var currentparams = [];

  // GET THE TYPES TAXONOMY
  var placetypes =[];

  var getplacetypes = function(onmap,callback){
    if(language != $rootScope.language){
      placetypes = [];
    }

    placetypes = []; //reset the placetypes to re-fetch EVERY time...
	getRecords('placetypes','dinings',[],$rootScope.language,function(res){
		placetypes=res;

		 if(onmap == "onmap"){
        var inject = new Object();        
        if($rootScope.language == 'fr'){
          inject.name = "Tous les Resturants";
        }else if($rootScope.language == 'en'){
          inject.name = "All Dinings";
        }
        inject.slug = "all";
        inject.term_id = "";
        placetypes.push(inject);
    }

    if(placetypes.length <= 0){
    $http.get('http://discoversaintjohn.com/api/dinings/types/?token=0x0C101B162C7011E29B5976846188709B&lang='+$rootScope.language+'')
      .success(function(data, status, headers, config){ console.log(status+' types [dining] ('+$rootScope.language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' types [dining] ('+$rootScope.language+')'); })
      .then(function(response){      
        var jsonData = response.data.types;
        var jsonKeys = Object.keys(jsonData);

        for (var i = 0; i < jsonKeys.length; i++) {
          var jsonSingle = jsonData[jsonKeys[i]];
		  insertRecord(jsonSingle,"placetypes","dinings",[],$rootScope.language);
          placetypes.push(jsonSingle);
        }
      })
    }

   callback(placetypes);
	});


      
  }

// GET THE FILTERED POSTS
  var flts = []; //drop this outside of the function to make available for lodash searching and injecting into our view
  
  var filterPlaces = function(callback,type, area, sort, isFiltered){
    if(!sort || sort == undefined){ sort = "p"; }
    var goFetch;

    if(language != $rootScope.language){
      language = $rootScope.language;
      goFetch = true; 
      flts = [];
    }

    var url = 'http://discoversaintjohn.com/api/dinings/directory/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&orderby='+sort+'&limitfr=0&limitto=1000';

    if(area || type){
      currentparams = [];
      currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "sort":"'+sort+'"}]');

      flts = []; //empty it so we're not appending (this does create a refresh/list position problem when navigating back however)
      goFetch = true;
      url = 'http://discoversaintjohn.com/api/dinings/filtered/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&area='+area+'&type='+type+'&orderby='+sort+'';
    }else{
      //if the flts array is already populated, it's not our first time here, so let's not push our array results.
      if(flts.length > 0){
        if(isFiltered){ //if we're trying to get a default list by submitting without area/type values.
          currentparams = []; //reset our parameters since it's a clean filter
          currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "sort":"'+sort+'"}]'); //should return empty type/area with populated sort.
          goFetch = true;
          flts = []; //reset our results.
        }else{
          goFetch = false;
		  callback(flts);
        }
      }else{
        goFetch = true;
      }
    }



    if(goFetch){
		
		getRecords('flts','dinings',currentparams,language,function(res){
			flts=res;
			if(flts.length<=0)
			{
			$http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' posts [dining] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' posts [dining] ('+language+')'); })
      .then(function(response){      
        var jsonData = response.data.dinings;
        var jsonKeys = Object.keys(jsonData);

        for (var i = 0; i < jsonKeys.length; i++) {
          var jsonSingle = jsonData[jsonKeys[i]];
		  insertRecord(jsonSingle,"flts","dinings",currentparams,language);
          flts.push(jsonSingle);
        }
      })	
			}
			
			callback(flts);
			});
      
	  
    }
    
  }

  var getSingle = function(postid,existing,callback){
	 
	  getSingleRecord(postid,function(res){
		  
		  if(res.length<=0)
		  {
		  url = 'http://discoversaintjohn.com/api/dinings/profile/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&id='+postid+'';


    
    var getdata = $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .then(function(response){ return response; })

    var defer = $q.defer();
    defer.resolve(getdata);
    callback(defer.promise);
		  }
		  else
		  {
			  callback(res);
		}
		  
		  });
    
  }
function checkFavourite(placeId,callback)
	{
		 checkFavouriteRecord(placeId,function(res){
		 callback(res);
		 });

		 
	}//checkFavourite
	function updatefavourite(option,placeId,callback)
	{
			 
		 updatefavourite(option,placeId,function(res){
		 callback(res);
		 });
	}
  return {
    all: function(callback) {
      return filterPlaces(callback);
    },
    get: function(placeId,existing,callback) { 
	
          return getSingle(placeId,existing,callback);
             
    },
    types: function(onmap,callback){
      return getplacetypes(onmap,callback);
    },
    filtered: function(callback,param_type, param_area, param_sort){
      return filterPlaces(callback,param_type, param_area, param_sort, true);
    },
	checkFavourite:function(placeId,callback)
	{
		return checkFavourite(placeId,callback);
	},
	updatefavourite:function(option,placeId,callback){
		return updatefavourite(option,placeId,callback)
		},
    currentparams: function(){
      return currentparams;
    }
  }
})


/*-----------------+
| SHOPPING SERVICE |
+-----------------*/
.factory('ShoppingService', function($http, $rootScope, $q) {
  var language = $rootScope.language;
  var currentparams = [];

  // GET THE TYPES TAXONOMY
  var placetypes =[];

  var getplacetypes = function(onmap,callback){
    if(language != $rootScope.language){
      placetypes = [];
    }

    placetypes = []; //reset the placetypes to re-fetch EVERY time...
	getRecords('placetypes','shoppings',[],language,function(res){
		placetypes=res;
		console.log(placetypes.length);
		 if(onmap == "onmap"){
        var inject = new Object();        
        if($rootScope.language == 'fr'){
          inject.name = "Tous les Magasinage";
        }else if($rootScope.language == 'en'){
          inject.name = "All Shopping";
        }
        inject.slug = "all";
        inject.term_id = "";
        placetypes.push(inject);
    }

    if(placetypes.length <= 0){
    $http.get('http://discoversaintjohn.com/api/shoppings/types/?token=0x0C101B162C7011E29B5976846188709B&lang='+$rootScope.language+'')
      .success(function(data, status, headers, config){ console.log(status+' types [shops] ('+$rootScope.language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' types [shops] ('+$rootScope.language+')'); })
      .then(function(response){      
        var jsonData = response.data.types;
        var jsonKeys = Object.keys(jsonData);

        for (var i = 0; i < jsonKeys.length; i++) {
          var jsonSingle = jsonData[jsonKeys[i]];
		  insertRecord(jsonSingle,"placetypes","shoppings",[],$rootScope.language);
          placetypes.push(jsonSingle);
        }
      })
    }

   callback(placetypes);
	});


      
  }

// GET THE FILTERED SHOPS
  var flts = []; //drop this outside of the function to make available for lodash searching and injecting into our view
  
  var filterPlaces = function(callback,type, area, sort, isFiltered){
    if(!sort || sort == undefined){ sort = "p"; }
    var goFetch;

    if(language != $rootScope.language){
      language = $rootScope.language;
      goFetch = true; 
      flts = [];
    }

    var url = 'http://discoversaintjohn.com/api/shoppings/directory/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&orderby='+sort+'&limitfr=0&limitto=1000';

    if(area || type){
      currentparams = [];
      currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "sort":"'+sort+'"}]');

      flts = []; //empty it so we're not appending (this does create a refresh/list position problem when navigating back however)
      goFetch = true;
      url = 'http://discoversaintjohn.com/api/shoppings/filtered/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&area='+area+'&type='+type+'&orderby='+sort+'';
    }else{
      //if the flts array is already populated, it's not our first time here, so let's not push our array results.
      if(flts.length > 0){
        if(isFiltered){ //if we're trying to get a default list by submitting without area/type values.
          currentparams = []; //reset our parameters since it's a clean filter
          currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "sort":"'+sort+'"}]'); //should return empty type/area with populated sort.
          goFetch = true;
          flts = []; //reset our results.
        }else{
          goFetch = false;
		  callback(flts);
        }
      }else{
        goFetch = true;
      }
    }

    console.log('url: '+url);

    if(goFetch){
		
		getRecords('flts','shoppings',currentparams,language,function(res){
			flts=res;
			if(flts.length<=0)
			{
				 $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' posts [shops] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' posts [shops] ('+language+')'); })
      .then(function(response){      
        var jsonData = response.data.shoppings;
        var jsonKeys = Object.keys(jsonData);

        for (var i = 0; i < jsonKeys.length; i++) {
          var jsonSingle = jsonData[jsonKeys[i]];
		  insertRecord(jsonSingle,"flts","shoppings",currentparams,language);
          flts.push(jsonSingle);
        }
      })	
			}
			
			callback(flts);
			});
      
	  
    }
    
  }

//promise for individual result
  var getSingle = function(postid,existing,callback){
	  
	  getSingleRecord(postid,function(res){
		 
		  if(res.length<=0)
		  {
    url = 'http://discoversaintjohn.com/api/shoppings/profile/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&id='+postid+'';

    console.log('url: '+url);
    
    var getdata = $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .then(function(response){ return response; })

    var defer = $q.defer();
    defer.resolve(getdata);
    callback(defer.promise);
		  }
		  else
		  {
		callback(res);
		}
	  });
  }

function checkFavourite(placeId,callback)
	{
		
		 checkFavouriteRecord(placeId,function(res){
		 callback(res);
		 });

		 
	}//checkFavourite
	function updatefavourite(option,placeId,callback)
	{
			 
		 updatefavourite(option,placeId,function(res){
		 callback(res);
		 });
	}
  return {
    all: function(callback) {
      return filterPlaces(callback);
    },
    get: function(placeId, existing,callback) {
          return getSingle(placeId,existing,callback);
              
    },
    types: function(onmap,callback){
      return getplacetypes(onmap,callback);
    },
    filtered: function(callback,param_type, param_area, param_sort){
      return filterPlaces(callback,param_type, param_area, param_sort, true);
    },
	checkFavourite:function(placeId,callback)
	{
		return checkFavourite(placeId,callback);
	},
	updatefavourite:function(option,placeId,callback){
		return updatefavourite(option,placeId,callback)
		},
    currentparams: function(){
      return currentparams;
    }
  }
})

/*---------------+
| EVENTS SERVICE |
+---------------*/
.factory('EventsService', function($http, $rootScope, $q) {
  var language = $rootScope.language;
  var currentparams = [];
 
  // GET THE SHOP TYPES TAXONOMY
  var placetypes =[];

  var getplacetypes = function(callback){
    if(language != $rootScope.language){
      placetypes = [];
    }

  getRecords('placetypes','events',[],$rootScope.language,function(res){
		placetypes=res;
		console.log(placetypes.length);
	  if(placetypes.length <= 0){
      $http.get('http://discoversaintjohn.com/api/events/types/?token=0x0C101B162C7011E29B5976846188709B&lang='+$rootScope.language+'')
      .success(function(data, status, headers, config){ console.log(status+' types [events] ('+$rootScope.language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' types [events] ('+$rootScope.language+')'); })
      .then(function(response){      
        var jsonData = response.data.types;
        var jsonKeys = Object.keys(jsonData);

        for (var i = 0; i < jsonKeys.length; i++) {
          var jsonSingle = jsonData[jsonKeys[i]];
		   insertRecord(jsonSingle,"placetypes","events",[],$rootScope.language);
          placetypes.push(jsonSingle);
        }
      })
	      }
    
   callback(placetypes);
	});
      
}

  // GET THE FILTERED POSTS
  var flts = []; //drop this outside of the function to make available for lodash searching and injecting into our view
  
  var filterPlaces = function(callback,type, area, date_range, from_date, to_date, isFiltered){
    var goFetch;

    if(language != $rootScope.language){
      language = $rootScope.language;
      goFetch = true; 
      flts = [];
    }

    var url = 'http://discoversaintjohn.com/api/events/directory/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&limitfr=0&limitto=1000';

    if(area || type || from_date || to_date){
      currentparams = [];
      currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "from_date":"'+from_date+'", "to_date":"'+to_date+'"}]');
      flts = []; //empty it so we're not appending (this does create a refresh/list position problem when navigating back however)
      goFetch = true;
      url = 'http://discoversaintjohn.com/api/events/filtered/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&from='+from_date+'&to='+to_date+'&area='+area+'&type='+type+'';
    }else{
      //if the flts array is already populated, it's not our first time here, so let's not push our array results.
      if(flts.length > 0){
        if(isFiltered){ //if we're trying to get a default list by submitting without area/type values.
          currentparams = []; //reset our parameters since it's a clean filter
          currentparams.push('[{"type":"'+type+'", "area":"'+area+'", "from_date":"'+from_date+'", "to_date":"'+to_date+'"}]'); //should return empty type/area with populated sort.
          goFetch = true;
          flts = []; //reset our results.
        }else{
          goFetch = false;
		  callback(flts);
        }
      }else{
        goFetch = true;
      }
    }

    console.log('url: '+url);
getRecords('flts','events',[],language,function(res){
		flts=res;
		if(placetypes.length>0)
		{
    if(goFetch){
      $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' posts [events] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' posts [events] ('+language+')'); })
      .then(function(response){      
        var jsonData = response.data.events;
        var jsonKeys = Object.keys(jsonData);

        for (var i = 0; i < jsonKeys.length; i++) {
          var jsonSingle = jsonData[jsonKeys[i]];
		 insertRecord(jsonSingle,"flts","events",currentparams,language);
          flts.push(jsonSingle);
        }
      })
    }
	}
    callback(flts);
  });
  }
  
  //promise for individual result
  var getSingle = function(postid,callback){
	  
	  getSingleRecord(postid,function(res){
		 
		  if(res.length<=0)
		  {
    url = 'http://discoversaintjohn.com/api/events/profile/?token=0x0C101B162C7011E29B5976846188709B&lang='+language+'&id='+postid+'';

    console.log('url: '+url);
    
    var getdata = $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' post [single] ('+language+')'); })
      .then(function(response){ return response; })

    var defer = $q.defer();
    defer.resolve(getdata);
    callback(defer.promise);
		  }
		  else
		  {
			  callback(res);
		  }
	  });
  }
function checkFavourite(placeId,callback)
	{
		 checkFavouriteRecord(placeId,function(res){
		 callback(res);
		 });

		 
	}//checkFavourite
	function updatefavourite(option,placeId,callback)
	{
			 
		 updatefavourite(option,placeId,function(res){
		 callback(res);
		 });
	}
  return {
    all: function(callback) {
      return filterPlaces(callback);
    },
    get: function(placeId,callback) {
		
          return getSingle(placeId,callback);
                
    },
    types: function(callback){
      return getplacetypes(callback);
    },
    filtered: function(callback,param_type, param_area, param_daterange, param_start_date, param_end_date){
      return filterPlaces(callback,param_type, param_area, param_daterange, param_start_date, param_end_date, true);
    },
	checkFavourite:function(placeId,callback)
	{
		return checkFavourite(placeId,callback);
	},
	updatefavourite:function(option,placeId,callback){
		return updatefavourite(option,placeId,callback)
		},
    currentparams: function(){
      return currentparams;
    }
  }
})
/*-------------+
| MAPS SERVICE |
+--------------*///get the map point data fromt he api
.factory('MapService', function($http, $rootScope, $q){

  var language = $rootScope.language;
  var currentparams = [];
  
  var filterMaps = function(thingstodo, accommodations, dining, shopping){
    currentparams = [];
    currentparams.push('[{"thingstodo":"'+thingstodo+'", "accommodations":"'+accommodations+'", "dining":"'+dining+'", "shopping":"'+shopping+'"}]');
    url = 'http://discoversaintjohn.com/api/maps/filtered/?token=0x0C101B162C7011E29B5976846188709B&thingstodo='+thingstodo+'&accommodations='+accommodations+'&dining='+dining+'&shopping='+shopping+'&lang='+language+'';

    console.log('url: '+url);
    
    var getdata = $http.get(url)
      .success(function(data, status, headers, config){ console.log(status+' posts [maps] ('+language+')'); })
      .error(function(data, status, headers, config){ console.log(status+' posts [maps] ('+language+')'); })
      .then(function(response){ return response; })

    var defer = $q.defer();
    defer.resolve(getdata);
    return defer.promise;
  }
  
  return {
    all: function(){
      return filterMaps();
    },
    filtered: function(thingstodo, accommodations, dining, shopping){
      return filterMaps(thingstodo, accommodations, dining, shopping);
    },
    currentparams: function(){
      return currentparams;
    }
  }
})
/*-----------------+
| VISITING SERVICE |
+-----------------*//* get the page content for the visiting page

The visiting page is a little screwed up right now due to having individual translations for en/fr.
English ID:   144
French ID:    1553

*/
.factory('VisitingService', function($http, $rootScope) {
  var language = $rootScope.language;

  var visit = [];

  var getvisit = function(callback){
    visit = []; //refresh each time..

    var pgid = "144";
    if($rootScope.language == "fr"){
      pgid = "1553";
    }

getRecords('page','page',[],$rootScope.language,function(res){
		visit=res;
if(visit.length<=0)
{
  $http.get('http://discoversaintjohn.com/api/pages/page/?token=0x0C101B162C7011E29B5976846188709B&lang='+$rootScope.language+'&id='+pgid+'')
    .success(function(data, status, headers, config){
      //console.log(status+' visiting page ('+$rootScope.language+') '+pgid);
    })
    .error(function(data, status, headers, config){
      //console.log(status+' visiting page ('+$rootScope.language+') '+pgid);
    })
    .then(function(response){
      var jsonData = response.data.page;
	  insertRecord(jsonData,"page","page",[],language);
      visit.push(jsonData);
      //console.log(jsonData);
    })
    callback(visit);
}
else
{
	callback(visit);
}
});
  }

  return {
    all: function(callback) {
      return getvisit(callback);
    }
  }
});