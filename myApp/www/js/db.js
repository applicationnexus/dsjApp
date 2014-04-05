var db;
init_();
function init_()
{
	
	db = openDatabase('mydb', '1.0', 'dsj', 5 * 1024 * 1024);
	createTables();
	
}
function createTables()
{
	db.transaction(function (tx) {  
  		 tx.executeSql('CREATE TABLE IF NOT EXISTS places_data (id integer primary key autoincrement,value text blob,type,param,currentparams,lang,placeid,favourite)');
	});
}
function insertRecord(value,type,param,currentparams,lang)
{
	var id=0;
	if(value.ID)
	{
		id=value.ID;
		
	}
	var data=JSON.stringify(value);
	db.transaction(function (tx) {  
  		 tx.executeSql('INSERT INTO places_data (id,value,type,param,currentparams,lang,placeid,favourite) values(null,?,?,?,?,?,?,"NO")',[data,type,param,escape(currentparams),lang,id]);
	})
}
function getRecords(type,param,currentparams,lang,callback)
{
	var currentP=JSON.stringify(currentparams);
	var q='';
	db.transaction(function (tx) {  
	if(param=='')
	{
		q='SELECT * FROM places_data where type="'+type+'" and lang="'+lang+'"';
	}
	else if(currentparams.length>0)
	{
		q='SELECT * FROM places_data where type="'+type+'" and param="'+param+'" and currentparams="'+escape(currentparams)+'" and lang="'+lang+'"';
	}
	else
	{
		q='SELECT * FROM places_data where type="'+type+'" and param="'+param+'" and lang="'+lang+'"';
	}
	

  		 tx.executeSql(q,[],function(tx, results){
			 var data=[];
			 for(var i=0;i<results.rows.length;i++)
			 {
				 		data.push(JSON.parse((results.rows.item(i).value)));
						if((results.rows.length-1)==i)
				 			{
								 callback(data);
				 			}
   				
				 
			 }
			 if(results.rows.length==0)
			 {
				 callback(data);
			 }
			 
			 });
	})
}
function getSingleRecord(id,callback)
{

	db.transaction(function (tx) {  
	 tx.executeSql('SELECT * FROM places_data where placeid='+id,[],function(tx, results){
			 var data=[];
			 
			 if(results.rows.item(0).value)
			 callback(JSON.parse((results.rows.item(0).value)));
			 
			 });
	})
}
function checkFavouriteRecord(id,callback)
{

	db.transaction(function (tx) {  
	 tx.executeSql('SELECT * FROM places_data where favourite="YES" and placeid='+parseInt(id),[],function(tx, results){

			 if(results.rows.length==0)
			 callback("NO");
			 else
			 callback("YES");
			 });
	})
}
function updatefavourite(option,id,callback)
{
	var setValue='';
	if(option=='add')
	{
		setValue='YES';
	}
	else
	{
		setValue='NO';
	}

	db.transaction(function (tx) {  
	 tx.executeSql('Update places_data SET favourite="'+setValue+'" where placeid='+id,[],function(tx, results){
				callback(setValue);
			 });
	})
}
