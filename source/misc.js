// JavaScript Document

// GLOBALS
var _serverApi;
var user_data_str;
var user_data;
var cities_data;
var gParkingActive;
var uriOfImageOfCarToAdd;
var cars_data;
var regions_data;
var done_with_cars_from_server;
var done_with_regions_from_server;
var use_geoloction = false;
var geolocation_result;  
var regions_template;


function base64_encode (data) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tyler Akins (http://rumkin.com)
  // +   improved by: Bayron Guevara
  // +   improved by: Thunder.m
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Pellentesque Malesuada
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Rafał Kukawski (http://kukawski.pl)
  // *     example 1: base64_encode('Kevin van Zonneveld');
  // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  // mozilla has this native
  // - but breaks in 2.0.0.12!
  //if (typeof this.window['btoa'] === 'function') {
  //    return btoa(data);
  //}
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = "",
    tmp_arr = [];

  if (!data) {
    return data;
  }
    
  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

}

function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
 
  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
 
  var a, b, c, d
  var chunk
 
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
 
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1
 
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }
 
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]
 
    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
 
    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1
 
    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
 
    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
 
    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
 
    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}

function asyncHttpGet(theUrl, car_index, app)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', theUrl, true);
    xhr.responseType = "arraybuffer";
    var parent = app;
    xhr.onload = function(e) 
    {
        if (e.srcElement.status == 200)
        {
            var ab = base64ArrayBuffer(this.response);
            localStorage.setItem('picture_for_car_' + car_index, "data:image/*;base64," + ab );
            console.log("car " + car_index + " picture size is " + ab.length); // this.response == uInt8Array.buffer
        }
        else
        {
            localStorage.setItem('picture_for_car_' + car_index, missing );
            console.log("car " + car_index + " no picture recieved from server"); // this.response == uInt8Array.buffer
        }
        car_assets_url[car_index] = localStorage.getItem('picture_for_car_' + car_index);
        // we update the display with new cars pictures as soon as they are received from server 
		parent.$.carousel.setImages(car_assets_url);
        parent.$.carousel.imagesChanged();
    };
    xhr.send();
}

function httpGet(theUrl)
{
    var xmlHttp = null;
    
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
    
function win(r) 
{
    console.log("Sent = " + r.bytesSent + "byes to server");

}

function fail(error) 
{
    //console.log("An error has occurred: Code = " + error);
    console.log("upload error source " + error.source);
}
         
	function uploadPhoto(car_id, imageURI) 
	{
		 _serverApi.upload_car_image(car_id, imageURI, win, fail);
	}

function Ticking(ticVal) 
{
	if (ticVal < 10) {
		ticVal = "0" + ticVal;
	}
	return ticVal;
}

function getWindowSizes() 
{
  var windowHeight = 0, windowWidth = 0;
  
  if (typeof (window.innerWidth) == 'number') 
  {
      windowHeight = window.innerHeight;
      windowWidth = window.innerWidth;
     // alert("1");
  }
  else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) 
  {
      windowHeight = document.documentElement.clientHeight;
      windowWidth = document.documentElement.clientWidth;
      // alert("2");
  }
  else if (document.body && (document.body.clientWidth || document.body.clientHeight)) 
  {
     windowHeight = document.body.clientHeight;
     windowWidth = document.body.clientWidth;
     // alert("3");
  }
  alert(window.innerHeight +  " " + document.documentElement.clientHeight + " " +  document.body.clientHeight + " " + screen.height);
  return [windowWidth, windowHeight];
}



function format_error_string(error)
{
	err1 = error.replace(/\"/g,"");
	err2 = err1.replace(/\{/g,"");
	err3 = err2.replace(/\}/g,"");
	err4 = err3.replace(/\[/g,"");
	err5 = err4.replace(/\]/g,"");
	err6 = err5.replace(/\:/g," ");
	err7 = err6.replace(/\_/g," ");
	return err7;
}


function prefill_local_storage()
{
	new_install = window.localStorage.getItem("new_install");
	if (new_install == null)  // new install - initialize all non volatile params
	{
		localStorage.setItem('use_geolocation',false);
		localStorage.setItem('ParkingActive', false);
		localStorage.setItem('chosen_car', 0 );
		localStorage.setItem('chosen_region_city', 0 );
		localStorage.setItem('chosen_region_suburb', 0 );
		localStorage.setItem('ParkingStartTime', "");
		localStorage.setItem('auth_token', "");
		localStorage.setItem('cars_data', "[]");
		localStorage.setItem('chosen_car_to_delete', 0 );
		localStorage.setItem('chosen_rate_id', 0 );
		localStorage.setItem('chosen_region_city', 0 );
		localStorage.setItem('cities_data', "[]");
		localStorage.setItem('payment_id', 0 );
		localStorage.setItem('user_data', "");
		localStorage.setItem('new_install',false);		
		localStorage.setItem('auto_login',false);
		localStorage.setItem('last_server_update',0);
		localStorage.setItem('geolocation_lat', 0 );
		localStorage.setItem('geolocation_lon', 0 );
		localStorage.setItem('cities_array', "[]");
		localStorage.setItem('suburbs_array', "[]");
		localStorage.setItem("last_parking_lat",0);
		localStorage.setItem("last_parking_lon",0);
	}
}

/*
function OnDocumentReady() 
{
	prefill_local_storage();
	set_callbacks();

	_serverApi = new serverApi();

	user_data_str = window.localStorage.getItem("user_data");
	user_data = null;
	if(user_data_str!="") {
	    user_data = JSON.parse(user_data_str);
	}
    
	// are we running in native app or in browser?
	window.isphone = false;
    
        //alert(navigator.userAgent);
    
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) 
	{
		window.isphone = true;
		//alert("window.isphone");
	} 


	    if(window.isphone) 
	    {
		console.log("adding deviceready event handler");
		document.addEventListener("deviceready", onDeviceReady, false);
	    } 
	    else 
	    {
		onDeviceReady();
	    }
}


*/
        

// =======================
// SIGNI/UP UI CALLBACKS
// =======================

     function prefillAccountDetails()
    {
        
            console.log("prefill");
            // OFER - get account details from server or from local storage ?
            document.getElementById("update_email-signin").value = user_data['user']['email']; // window.localStorage.getItem("last_email_signin");
            document.getElementById("update_password-signin").value = user_data['user']['password']; // window.localStorage.getItem("last_password_signin");
            document.getElementById("update_firstname").value = user_data['user']['firstname']; //window.localStorage.getItem("last_lastname");
            document.getElementById("update_lastname").value = user_data['user']['lastname']; //window.localStorage.getItem("last_lastname");
            document.getElementById("update_phone").value = user_data['user']['phone']; // window.localStorage.getItem("last_phone");
            document.getElementById("update_credit_card_number").value = user_data['user']['credit_card_number']; // window.localStorage.getItem("last_credit_card_number");
    }
    
        
         
// =======================
// CAR MANAGEMENT CALLBACKS
// =======================
 

 
// =======================
// ACCOUNT MANAGEMENT CALLBACKS
// =======================
 
   

	
	function Ticking(ticVal) {
		if (ticVal < 10) {
			ticVal = "0" + ticVal;
		}
		return ticVal;
	}
    
 
    
/* ===================== */
/* CAR SELECTION SCROLER */
/* ===================== */


	
 
    function get_rate_at_current_time(rate_array)
    {
	var d = new Date();
    	var day = d.getDay();
    	var hours = d.getHours();
    	var minutes = d.getMinutes();
    	var rate = 0;
    	var time = parseInt(hours.toString()+minutes.toString());
    	localStorage.setItem("chosen_rate_id", 0);
    	for (i = 0; i < rate_array.length; i++)
    	{
    		if ((day >= rate_array[i].start_day_a_week) && (day < rate_array[i].end_day_a_week) &&  (time >= rate_array[i].start_time_int) && (time < rate_array[i].end_time_int))
		{
			rate = rate_array[i].rate;
			localStorage.setItem("chosen_rate_id", rate_array[i].id);
		}
    	}
    	return rate;
    }
/* ======================== */
/* REGION SELECTION SCROLER */
/* ======================== */


	function set_up_regions_template(data)
	{
		var temp;
		var str;
		str=""; 
		for (var i = 0; i < data.length; i++) 
		{ 
			str = str + sprintf("<li data-val=\"%d\">%s<ul>",i,data[i].name);
			for (var j = 0; j < data[i].areas.length; j++)
			{
				str = str + sprintf("<li data-val=\"%d\">%s</li>",j, data[i].areas[j].name );
			}
			str = str + "</ul></li>\n";
                }
               
               	str = "\n<div class=\"icc\">\n<div class=\"ic\">\n<ul id=\"RegionsListScroller\">\n" + str + "\n</ul>\n</div>\n</div>\n";
              
              return str; 	

	}

    
missing = "data:image/*;base64,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";


