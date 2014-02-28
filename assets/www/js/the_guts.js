var currentLocation = null;
var radius = window.localStorage.getItem("alertRadius");
var pollInt = (window.localStorage.getItem("pollInt")*1000);
var measurement = window.localStorage.getItem("measurement");
var arr = new Array();
var db = window.openDatabase("tree_db", "1.0", "Colorado Tree Coalition DB", 200000); //open db

document.addEventListener("deviceready", onDeviceReady, false); //Device ready listener fires cordova is ready to function

function onDeviceReady() 
{    
    first_run(db);
    db.transaction(queryDB, errorCB);    
}
//Populate the database 
//
function populateDB(tx) {
     tx.executeSql('DROP TABLE IF EXISTS TREES');
     tx.executeSql('CREATE TABLE IF NOT EXISTS TREES (id unique, BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes)');            
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (1, "Malus species", "Common Apple", 35, 41, 36, 159.9, 39.864014, -105.070195, "1T", "NW Corner of 92nd & Pierce")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (2, "Prunus mandshurica", "Apricot", 36, 40, 33, 161.29, 40.013252, -105.283393, "1T","9th st. & Arapahoe")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (3, "Prunus mandshurica", "Apricot", 39, 25, 43, 158.21, 38.442094, -105.011455, "1T", "425 I street")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (4, "Fagus sylvatica", "Cutleaf European Beech", 3.20, 17, 10, 29.55, 39.788291, -105.032752, "1", "Regis/SW corner of Science Bldg")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (5, "Fagus sylvatica", "European Weeping Beech", 5.7, 16, 16, 37.90, 39.788291, -105.032752, "2", "Regis/NW corner of Carroll Hall")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (6, "Fagus sylvatica", "Tri-Color Beech", 9.4, 25, 24, 60.52, 39.731993, -104.960117, "2", "Denver Botanic Gardens/Morrison Center Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (7, "Betula nigra", "River Heritage Birch", 6.9, 23, 30, 52.17, 39.788291, -105.032752,"1", "Regis/North of oSullivan Center")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (8, "Aesculus glabra", "Ohio Buckeye", 29, 47, 49, 150.31, 38.846711, -104.834391, "1", "Near center of park")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (9, "Aesculus glabra", "Ohio Buckeye", 27.90, 47, 28, 141.61, 39.670129, -104.98272,"2T", "")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (10, "Aesculus glabra", "Ohio Buckeye", 24.10, 54, 38, 139.17, 40.58775, -105.111035, "2T", "Grandview Cemetery/60 yards N of office")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (11, "Aesculus octandra", "Yellow Buckeye", 35.50, 73, 48, 196.47, 39.703803, -104.968862, "1", "Washington Park/SW corner of Franklin & Exposition")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (12, "Aesculus octandra", "Yellow Buckeye", 29.30, 81, 41, 183.25, 40.0102, -105.273324, "2", "CU campus/ West of Mackey Auditorium")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (13, "Aesculus octandra", "Yellow Buckeye", 29.20, 71, 41, 172.94, 39.692893, -104.967359, "3", "South High School/ South sideyard")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (14, "Aesculus octandra", "Yellow Buckeye", 26.60, 58, 44, 152.52, 39.677957, -104.960713, "4", "DU Campus/SW corner of Mary Reed Bldg")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (15, "Shepherdia arentea", "Silver Buffaloberry", 9.10, 27, 14, 59.07, 39.604983, -105.021771, "1", "Hudson Gardens/unusual tree garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (16, "Cedrus libani", "Cedar of Lebanon", 6.80, 34, 16, 59.35, 39.676039, -104.9625556, "2", "Hudson Gardens/unusual tree garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (17, "Cedrus libani", "Cedar of Lebanon", 5.10, 20, 12, 39.01, 39.731993, -104.960117, "3", "Denver Botanic Gardens/Scripture Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (18, "Cedrus atlantica", "Blue Atlas Cedar", 7.50, 26, 13, 52.80, 39.788291, -105.032752, "3T", "Regis/ North of Loyola Hall")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (19, "Prunus serotina", "Black Cherry", 34.10, 73, 51, 192.82, 39.706955, -104.973311, "1", "Washington Park/Across from 525 Downing St.East of Driveway")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (20, "Castanea dentata", "American Chestnut", 20.20, 42, 22, 110.93, 40.01379, -105.267938, "1", "American Chestnut")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (21, "Chilopsis tashkentensis", "Chitalpa", 4.30, 17, 17, 34.75, 39.04855, -108.52993, "1", "West Side of intersection")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (22, "Prunus maackii", "Amur Chokecherry", 7.9, 24, 15, 52.56, 39.788291, -105.032752, "1", "Regis/ West side of Regis Chapel")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (23, "Gymnocladus dioicus", "Kentucky Coffeetree", 43.60, 87, 61, 239.15, 38.26392, -104.653495, "1", "City Park/ across from fountain")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (24, "Gymnocladus dioicus", "Kentucky Coffeetree", 37.40, 71, 69, 205.69, 39.698485, -104.969071, "2", "Washington Park/80 yards W of Tennessee Ave and Franklin St")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (25, "Cupressus bakeri", "Modoc Cypress", 15.30, 35, 19, 87.79, 39.731993, -104.960117, "1", "Denver Botanic Gardens/Rock Alpine Garden south edge")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (26, "Chamaecyparis nootkatensis", "Weeping Alaskan False Cypress", 8, 21, 15, 49.87, 39.731993, -104.960117, "1", "Denver Botanic Garndes/Rock Alpine Garden West edge")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (27, "Cornus kousa", "Japanese Dogwood", 5.30, 11, 12, 30.64, 39.731993, -104.960177, "1", "Waring House Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (28, "Sambucus nigra", "Black Elder", 8.60, 31, 19, 62.75, 39.731993, -104.960117, "1", "Denver Botanic Gardens/Birds and Bees Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (29, "Ulmus americana", "American Elm", 61, 90, 105, 307.79, 40.587253, -105.088708, "2T", "714 W. Mountain Ave")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (30, "Ulmus davidiana", "Japanese Elm", 14.30, 45, 28, 96.90, 39.731993, -104.960117, "1", "Denver Botanic Gardens/ Cutting Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (31, "Ulmus rubra", "Red Elm", 50.80, 76, 93, 258.76, 40.586629, -105.086267, "1", "105 S. Whticomb st.")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (32, "Ulmus thomasii", "Rock Elm", 36.60, 87, 78, 221.42, 40.578034, -105.078017, "2", "CSU Campus/5th tree west of College Ave on Laurel Ave")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (33, "Corylus colurna", "Turkish Filbert", 15.20, 51, 26, 105.23, 39.731993, -104.960117, "2", "Denver Botanic Gardens/Waring House Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (34, "Abies homolepis", "Nikko Fir", 8.90, 30, 23, 63.70, 39.731993, -104.960117, "1", "Denver Botanic Gardens/Birds and Bees Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (35, "Ginkgo biloba", "Ginkgo", 19, 56, 34, 124.16, 39.741164, -104.955737, "2T", "East High Shcool/ South Courtyard")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (36, "Ginkgo biloba", "Ginkgo", 18.30, 54, 32, 119.46, 39.692733, -104.966887, "2T", "South High Shcool/ NW corner of bldg")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (37, "Koelreuteria paniculata", "Goldenrain Tree", 30, 40, 35, 142.95, 39.731993, -104.960117, "1", "Denver Botanic Gardens/Picnic Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (38, "Celtis laevigata", "Sugar Hackberry", 41.20, 63, 74, 210.87, 39.738861, -104.986336, "1", "Civic Center Park/15 yds N. of Lincoln st. and 14th ave")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (39, "Crataegus mollis", "Downy Hawthorn", 32.10, 25, 50, 138.29, 39.731413, -104.965197, "1T", "South of parthenon, 100ft west of port-o-let enclosure")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (40, "Crataegus mollis", "Downy Hawthorn", 30.20, 34, 40, 138.83, 39.729595, -104.967206, "1T", "50ft north of south road, across from Gilpin st")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (41, "Gleditsia tricanthos", "Thorned Honeylocust", 45.10, 84, 68, 242.61, 39.736486, -10496457, "1", "NE corner")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (42, "Gleditsia tricanthos inermis", "Thornless Honeylocust Pincushion", 10.5, 43, 23, 81.72, 39.731993, -104.960117, "1", "Denver Botanic Gardens/ Picnic Garden")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (43, "Ostrya virginiana", "American Hophornbeam", 8, 42, 22, 72.62, 39.731993, -104.960177, "1", "Denver Botanic Gardens/Waring House")');
     tx.executeSql('INSERT INTO TREES (id,BotName, ComName, DBH, Height, CrownSpread, Points, latitude, longitude, rank, notes) VALUES (44, "Carpinus caroliniana", "American Hornbeam", 5.10, 32, 31, 55.76, 39.731993, -104.960117, "1", "Denver Botanic Gardens/Waring House")');
     
}

//creates the database if this is the first run of the app
//
function first_run(db) 
{
	var firstRun = window.localStorage.getItem("FirstRun"); 
	if(firstRun == null) //check if this is the first run
	{
		db.transaction(populateDB, errorCB, successCB); //Create the db
		window.localStorage.setItem("FirstRun", "false");
		window.localStorage.setItem("alertRadius", 50);
		radius=window.localStorage.getItem("alertRadius");
	}
}
//Transaction success callback
//
function successCB()
{
    
}

// Transaction error callback
//
function errorCB(err)
{
    alert("Error processing SQL: "+err.code);
}
//Select everything from the Trees database
//
function queryDB(tx)
{
    tx.executeSql('SELECT * FROM TREES', [], querySuccess, errorCB);
}

function queryER()
{
    alert("Query Error");
}

//Push the query results to a global variable so other functions can access them without being passed them
function querySuccess(tx,results)
{
    getLocation(results); //get location which calls draw map, distance and plot points
}

function getLocation(res)
{
    $.mobile.loading( 'show', {
        text: 'loading map',
        textVisible: true,
        html: ""
    });
    navigator.geolocation.getCurrentPosition(function(pos)
    {
        currentLocation = {longitude:pos.coords.longitude, latitude:pos.coords.latitude};
        draw_map(res);
    }
    , function(err)
    {
        draw_map(res);
        if (watchID != null) 
        {
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
        }
        alert("Sorry, but we couldn't find your location.");
    }
    ,{maximumAge: pollInt,timeout: 10000,enableHighAccuracy:true});
}

function draw_map(res)
{
    if(currentLocation != null)
    {
        loc_string = currentLocation.longitude + ", " + currentLocation.latitude;
        
         $('#map_canvas').gmap('addMarker', {
        	'id':'myPos',
        	'position':loc_string,
        	'icon' : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    	});
        var yourStartLatLng = new google.maps.LatLng(currentLocation.longitude, currentLocation.latitude);
        $.mobile.loading( 'hide');
        $('#map_canvas').gmap({'zoom':8, 'center': loc_string});
        //alert("Made It past map");
        plot_points(res);
        //alert("made it past plot");
        
    }
    else
    {
        $.mobile.loading( 'hide');
        var yourStartLatLng = new google.maps.LatLng(39.079583, -108.554097);
        $('#map_canvas').gmap({'zoom':8, 'center': '39.079583, -108.554097'});
        alert("Sorry Treefinder cannot function without your Current Location, turn on your gps and try again");
    }
}


function plot_points(res)
{
    var len = res.rows.length;
    var $marker= {
            show:null,
            content:null,
            location:null
    };
    
    for (var j=0; j<len; j++){
        $marker.location = res.rows.item(j).latitude+","+res.rows.item(j).longitude; //put lat + long in a comma delimited string 
        $marker.content =  '<div style="padding: 0px; text-align:left; font-size:11px;" align="left">'
                            +'<p><b>Name:   </b>'+res.rows.item(j).ComName+'</p><p><b>Bot. Name:   </b>'
                            +res.rows.item(j).BotName + '</p><p><b> DBH:   </b>'+ res.rows.item(j).DBH
                            +'</p><p><b> Height:   </b>'+ res.rows.item(j).Height +'</p><p><b> Crown Spread:   </b>'
                            + res.rows.item(j).CrownSpread +'</p><p><b> Points:   </b>'+ res.rows.item(j).Points
                            +'</p><p><b> Rank:   </b>'+ res.rows.item(j).rank +'</p><p><b> Notes:   </b>'+ res.rows.item(j).notes +'</p></div>';
        arr[j]=[
                $marker.content
                ];   
    }
    for (var i=0; i<len; i++)
    {
        //Check that the points are in our radius and only plot the ones that are
        var dist = distance(res.rows.item(i).latitude, res.rows.item(i).longitude);
        if(dist < radius)
        {
            $marker.location = res.rows.item(i).latitude+","+res.rows.item(i).longitude; //put lat + long in a comma delimited string             
            $marker.show=$('#map_canvas').gmap('addMarker', {id: i,'position': $marker.location,'icon': "images/tree.png", 'bounds': true});
            var test= $marker.show;
            $('#map_canvas').gmap('addMarker', {id: i,'position': $marker.location,'icon': "images/tree.png", 'bounds': true}).click(function()
            {
                $('#map_canvas').gmap('openInfoWindow', {'content': arr[this.id][0]}, this);
            });
        }
    }
 
}
//**********************************************
//DISTANCE FUNCTIONS
//
//
//
//
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
//
//
//
//**********************************************


