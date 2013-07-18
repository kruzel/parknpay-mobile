
/* ===================== */
/* CAR SELECTION SCROLER */
/* ===================== */
var template = kendo.template($("#CarsListScrollerTemplate").html());

console.assert(1);


var data = 
    [{ID: 0, registration: "12-234-11", PictureUrl: "https://dl.dropboxusercontent.com/u/1495669/car2.png", Name: "Car1"},
     {ID: 1, registration: "12-234-22", PictureUrl: "https://dl.dropboxusercontent.com/u/1495669/car1.png", Name: "Car2"}];

function prepare_template() 
{
	var data = {};
	_serverApi.get_cars({ data: data, 
		success: function(response) 
		{
			var cars_list = respons;
		},
		error: function(error) 
		{
			console.log(error);
			app.hideLoading();
	}});
	var result = template(data); //Execute the template
	$("#CarsListScrollerTemplateResults").html(result);
}

prepare_template();

/* this will put on the home screen the last chosen car*/
pid = localStorage.getItem("chosen_car");

if (pid != null )
{
    document.getElementById("car_selection_item_title").innerHTML = data[pid].registration;
    document.getElementById("car_selection_item_description").innerHTML = data[pid].Name;
}
else
{
    document.getElementById("car_selection_item_title").innerHTML = "No Car"
    document.getElementById("car_selection_item_description").innerHTML = "registered yet...";
}

 
$('#CarsListScroller').mobiscroll().image({
    theme: 'android',
    display: 'modal',
    mode: 'scroller',
    labels: ['My Car'],
    inputClass: 'i-txt',
    setText: 'OK',
    onSelect: function (v, inst) 
              {
              },
    onChange: function (v, inst) 
              {
                  $("#car_selection_item_title").html(data[v].registration);
                  $("#car_selection_item_description").html(data[v].Name);
                  /* save the car selected in persistent storage */
                  localStorage.setItem("chosen_car", v);
              },
    /*
    onBeforeShow: function (html, inst) 
            {
                
                pid = localStorage.getItem("chosen_car");
            },
    */
});

if (data[pid] != null)
{
     $('#CarsListScroller').mobiscroll('setValue', [pid, data[pid].registration , data[pid].PictureUrl ],true,.2);    
}

$('#car_selection').click(function() {
    prepare_template();
    pid = localStorage.getItem("chosen_car");
    $('#CarsListScroller').mobiscroll('show');
	return false;
});

/* ======================== */
/* REGION SELECTION SCROLER */
/* ======================== */
/* OFER: insert here API call to get the user relevant regions */

var regions_data = 
    [{ID: "0", City: "Sydney", Suburb: 
        [
        {ID: "0", sub: "Badgerys Creek", info:"", rate: 0.1},
        {ID: "1", sub: "Balgowlah", info:"", rate: 0.2},
        {ID: "2", sub: "Balgowlah Heights", info:"", rate: 0.3},
        {ID: "3", sub: "Balmain", info:"", rate: 0.4},
        {ID: "4", sub: "Balmain East", info:"", rate: 0.5},
        {ID: "5", sub: "Banksia", info:"", rate: 0.6},
        {ID: "6", sub: "Banksmeadow", info:"", rate: 0.7},
        {ID: "7", sub: "Bankstown",info:"", rate: 0.8}
        ]},
    {ID: "1", City: "Newcastle", Suburb: 
        [
        {ID: "0", sub: "Adamstown", info:"", rate: 0.15},
        {ID: "1", sub: "Adamstown Heights",info:"", rate: 0.25},
        {ID: "2", sub: "Bar Beach", info:"", rate: 0.35},
        {ID: "3", sub: "Beresfield", info:"", rate: 0.45},
        {ID: "4", sub: "Birmingham Gardens", info:"", rate: 0.55},
        {ID: "5", sub: "Black Hill", info:"", rate: 0.65},
        {ID: "6", sub: "Banksmeadow",info:"", rate: 0.75},
        {ID: "7", sub: "Callaghan", info:"", rate: 0.85}
        ]}
];
var regions_template = kendo.template($("#RegionsListScrollerTemplate").html());
function prepare_regions_scroller_template() 
{
     
    var result = regions_template(regions_data); //Execute the template
    /* console.log(result); */
    $("#RegionsListScrollerTemplateResults").html(result);
}
prepare_regions_scroller_template();

pid1 = localStorage.getItem("chosen_region_city");
pid2 = localStorage.getItem("chosen_region_suburb");

$('#RegionsListScroller').mobiscroll().treelist({
    theme: 'android',
    display: 'modal',
    mode: 'scroller',
    labels: ['City', 'Suburb'],
    inputClass: 'i-txt',
    setText: 'OK',
    onSelect: function (v, inst) 
              {
               },
    onChange: function (v, inst) 
              {
                  $("#region_selection_item_title").html(regions_data[inst.temp[0]].Suburb[inst.temp[1]].sub  + ", " + regions_data[inst.temp[0]].City);
                  /* $("#region_selection_item_description").html("What a nice location "+v+" is!"); */
                  localStorage.setItem("chosen_region_city", inst.temp[0]);
                  localStorage.setItem("chosen_region_suburb", inst.temp[1]);
                  localStorage.setItem("chosen_region_rate", regions_data[inst.temp[0]].Suburb[inst.temp[1]].rate);
                  $("#region_selection_item_description").html(regions_data[inst.temp[0]].Suburb[inst.temp[1]].rate + "$/h");
              },
});   

if ((pid1 != null) && (pid2 != null))
{
     $("#region_selection_item_title").html(regions_data[pid1].Suburb[pid2].sub  + ", " + regions_data[pid1].City);
     //$("#region_selection_item_title").html(pid2 + ", " + pid1);
     $('#RegionsListScroller').mobiscroll('setValue', [pid1, pid2 ],true,.2);   
     $("#region_selection_item_description").html(regions_data[pid1].Suburb[pid2].rate + "$/h");
}



$('#region_selection').click(function() {
    prepare_regions_scroller_template();
	$('#RegionsListScroller').mobiscroll('show');
	return false;
});

/* ======================== */
/* PARKING SELECTION SCROLER */
/* ======================== */

status = localStorage.getItem("ParkingActive");
/*
if (status != null)
{
     document.getElementById("modalview-parking-action").src="images/media-play-inv.png";   
}
else
{
    document.getElementById("modalview-parking-action").src="images/media-stop-inv.png";
}


$('#modalview-parking-action-close').click(function() 
{
    $("#modalview-parking-action").kendoMobileModalView("close");
	return false;
});

$('#parking_selection').click(function() 
{
    $("#modalview-parking-action").kendoMobileModalView("open");
	return false;
});
*/
/*
$('#qrcode').click(function() 
{
		window.plugins.barcodeScanner.scan(function(result) {
		alert("We got a barcode\n" +
			  "Result: " + result.text + "\n" +
			  "Format: " + result.format + "\n" +
			  "Cancelled: " + result.cancelled);
	}, function(error) {
		alert("Scanning failed: " + error);
	}
	);

	return false;
});
*/
$('#parking_selection').click(function() 
{
    pid = localStorage.getItem("chosen_car");
    pid1 = localStorage.getItem("chosen_region_city");
    pid2 = localStorage.getItem("chosen_region_suburb");
    if ((pid == null) || (pid1 == null) || (pid2 == null))
    {
        alert("Please set the can and the location first");
        return false;
    }
 
    status = localStorage.getItem("ParkingActive");
    if ((status == null) || (status == 0 ))
    {
        
        var dt = new Date(); 
		   ParkingActive = true;
        localStorage.setItem("ParkingActive", "1");
        localStorage.setItem("ParkingStartTime", dt);
		   digitized();
        console.log('parking started');
        document.getElementById('parking_selection_item-title').innerHTML = '';
        /* $("#modalview-parking-action").kendoMobileModalView("close"); */
		return false;
    }
    else
    {
       ParkingActive = false;
        localStorage.setItem("ParkingActive", "0");
        console.log('parking stoped');
        document.getElementById('parking_selection_item-title').innerHTML = 'Inactive';
        document.getElementById('parking_selection_item-info').innerHTML = '';
        //document.getElementById('parking_cost').innerHTML = '';
        //document.getElementById('dc_second').innerHTML = '';
        //document.getElementById('cost').innerHTML = '';
        
		return false;  
    }
});


function digitized() 
{
    var dt = new Date();    // DATE() CONSTRUCTOR FOR CURRENT SYSTEM DATE AND TIME.
    var lt = new Date(localStorage.getItem("ParkingStartTime"));
    var t2 = dt.getTime();
    var t1 = lt.getTime();

       
    var dys = parseInt((t2-t1)/(24*3600*1000));
    var hrs = parseInt((t2-t1)/(3600*1000) % 24);
    var min = parseInt((t2-t1)/(60*1000) % 60 );
    var sec = parseInt((t2-t1)/1000 % 60);

    /*
    var hrs = dt.getHours();
    var min = dt.getMinutes();
    var sec = dt.getSeconds();
    */
    min = Ticking(min);
    sec = Ticking(sec);

    //var el1 = document.getElementById('dc');
    var el1 = document.getElementById('parking_selection_item-title');
    
    if (ParkingActive)
    {
        el1.innerHTML = hrs + ":" + min + ":" + sec; 
        //document.getElementById('dc_second').innerHTML = sec;
        var rate =  localStorage.getItem("chosen_region_rate");
        document.getElementById('parking_selection_item-info').innerHTML = parseInt( sec * rate / 3600)+'$';   
        //document.getElementById('cost').innerHTML = parseInt( sec * rate / 3600)+'$';        
    }
    /*
    if (hrs > 12) 
    { 
        document.getElementById('dc_hour').innerHTML = 'PM'; 
    }
    else 
    { 
         document.getElementById('dc_hour').innerHTML = 'AM'; 
    }
    */
    var time;
    
    // THE ALL IMPORTANT PRE DEFINED JAVASCRIPT METHOD.
    if (ParkingActive)
    {
        time = setTimeout('digitized()', 1000);      
    }
}

function Ticking(ticVal) 
{
    if (ticVal < 10) 
    {
        ticVal = "0" + ticVal;
    }
    return ticVal;
}

if ((localStorage.getItem("ParkingActive") == undefined) || (localStorage.getItem("ParkingActive") == "0")) 
{
    document.getElementById('parking_selection_item-title').innerHTML = 'Inactive';
    // document.getElementById('dc_second').innerHTML = '';
    //document.getElementById('cost').innerHTML = '';
	ParkingActive = false;
}
else 
{
    /* document.getElementById('parking_selection_item-title').innerHTML = 'Parking Active'; */
	ParkingActive = true;
}

if (ParkingActive)
{
    
    digitized();
}            


function homeBeforShow(e)
{
    console.log(e.view);
   
}
