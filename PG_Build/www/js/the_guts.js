var currentLocation = null;
var radius = window.localStorage.getItem("alertRadius");
var pollInt = (window.localStorage.getItem("pollInt")*1000);
var measurement = window.localStorage.getItem("measurement");
var res = null;
var arr = new Array();

document.addEventListener("deviceready", onDeviceReady, false); //Device ready listener fires cordova is ready to function

//creates the database if this is the first run of the app
function first_run(db) 
{
	var firstRun = window.localStorage.getItem("FirstRun"); 
	if(firstRun == null) //check if this is the first run
	{
		db.transaction(populateDB, errorCB, successCB); //Create the db
		window.localStorage.setItem("FirstRun", "false");
	}
}

function haversine(val) //return sin^2 val
{
	return ((1 - Math.cos(val)) / 2);
}

//return the radian measure of the degree measure passed into the function
function to_rad(degrees)
{
	return degrees * (Math.PI/180);
}

//returns the distance between the devices current location and the lat, long pushed into the function
function distance(lat, long)
{
	var r = 3956.6; //Radius of the earth in miles
	var lamda = Math.abs((lat - currentLocation.latitude) * (Math.PI/180)); 
	var theta = Math.abs((long - currentLocation.longitude) * (Math.PI/180));
	var a_inner = Math.abs(haversine(lamda) + Math.cos(to_rad(lat)) * Math.cos(to_rad(currentLocation.latitude)) * haversine(theta));
	var a = Math.sqrt(a_inner);
	var d = 2*r*Math.asin(a);
	return d;
}

//Populate the database 
function populateDB(db)
{    		
	 db.executeSql('DROP TABLE IF EXISTS TREES');
     db.executeSql('CREATE TABLE IF NOT EXISTS TREES (id unique, name, species, latitude, longitude)');
     db.executeSql('INSERT INTO TREES (id, name, species, latitude, longitude) VALUES (1, "Pine", "Pine_Species", 39.081173, -108.554561)');
     db.executeSql('INSERT INTO TREES (id, name, species, latitude, longitude) VALUES (2, "Douglas Fur", "Fur_Species", 40.346544,-104.031189)');
     db.executeSql('INSERT INTO TREES (id, name, species, latitude, longitude) VALUES (3, "Maple", "Maple_Species", 38.608286,-106.338318)');
     db.executeSql('INSERT INTO TREES (id, name, species, latitude, longitude) VALUES (4, "Oak", "Oak_Species", 39.75788,-107.711609)');
     db.executeSql('INSERT INTO TREES (id, name, species, latitude, longitude) VALUES (5, "Aspen", "Aspen_Species", 38.487995,-108.491638)');
     db.executeSql('INSERT INTO TREES (id, name, species, latitude, longitude) VALUES (6, "Pine", "Pine_Species", 39.752799, -104.954809)');
}

// Transaction success callback
//
function successCB()
{
    db_alive = true;
}

// Transaction error callback
//
function errorCB(err)
{
    db_alive = false;
	alert("Error processing SQL: "+err);
}

function queryER()
{
	alert("Query Error");
}

//Push the query results to a global variable so other functions can access them without being passed them
function querySuccess(db, results)
{
	res = results;
}

function queryDB(db)
{
    db.executeSql('SELECT * FROM TREES', [], querySuccess, errorCB);
    //db.executeSql('SELECT * FROM TREES WHERE latitude BETWEEN //Lat high ' AND' //Lat low, [], querySuccess, errorCB);
}

function getLocation()
{
	$.mobile.loading( 'show', {
		text: 'loading map',
		textVisible: true,
		html: ""
	});
    navigator.geolocation.watchPosition(function(pos)
    {
    	currentLocation = {longitude:pos.coords.longitude, latitude:pos.coords.latitude};
    	draw_map();
    }
    , function(err)
    {
    	draw_map();
    	if (watchID != null) 
    	{
    		navigator.geolocation.clearWatch(watchID);
            watchID = null;
    	}
    	alert("Sorry, but we couldn't find your location.");
    }
    ,{maximumAge: pollInt,timeout: 10000,enableHighAccuracy:true});
}

function draw_map()
{
	if(currentLocation != null)
	{
		loc_string = currentLocation.longitude + ", " + currentLocation.latitude;
		var yourStartLatLng = new google.maps.LatLng(currentLocation.longitude, currentLocation.latitude);
	    $('#map_canvas').gmap({'zoom':9, 'center': loc_string});
	    plot_points(res);
	}
	else
	{
		$.mobile.loading( 'hide');
		var yourStartLatLng = new google.maps.LatLng(39.079583, -108.554097);
	    $('#map_canvas').gmap({'zoom':9, 'center': '39.079583, -108.554097'});
	    alert("Sorry Treefinder cannot function without your Current Location, turn on your gps and try again");
	}
}

function plot_points(results)
{
	var len = results.rows.length;
	
	var $marker= {
	        show:null,
	        content:null,
	        location:null
	};
	
	for (var j=0; j<len; j++){
	    $marker.location = results.rows.item(j).latitude+","+results.rows.item(j).longitude; //put lat + long in a comma delimited string 
        $marker.content = "Name: "+results.rows.item(j).name+"<br /> Species: "+results.rows.item(j).species;
        arr[j]=[$marker.location,
                $marker.content
                ];   
	}
    for (var i=0; i<len; i++)
    {
    	//Check that the points are in our radius and only plot the ones that are
    	var dist = distance(results.rows.item(i).latitude, results.rows.item(i).longitude);
    	if(dist < radius)
    	{
    	    //arr[i]="Name: "+results.rows.item(i).name+" Species: "+results.rows.item(i).species;
    		$marker.location = results.rows.item(i).latitude+","+results.rows.item(i).longitude; //put lat + long in a comma delimited string 
    		$marker.content = "Name: "+results.rows.item(i).name+" Species: "+results.rows.item(i).species;
    		$marker.show=$('#map_canvas').gmap('addMarker', {id: i,'position': $marker.location,'icon': "images/tree.png", 'bounds': true});
    		var test= $marker.show;
    		$('#map_canvas').gmap('addMarker', {id: i,'position': $marker.location,'icon': "images/tree.png", 'bounds': true}).click(function()
            {
                $('#map_canvas').gmap('openInfoWindow', {'content': arr[this.id][1]}, this); //fix me
            });
    	}
    }
    $.mobile.loading( 'hide');
}

function onDeviceReady() //this is now our hook to fire functions device.live is uneeded
{
    var db = window.openDatabase("tree_db", "1.0", "Colorado Tree Coalition DB", 200000); //open db
    first_run(db);
    db.transaction(queryDB, queryER);
    getLocation(); //get location which calls draw map, distance and plot points
}