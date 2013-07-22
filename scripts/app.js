// JavaScript Document

// GLOBALS
var _serverApi;
var user_data_str;
var user_data;
var ParkingActive;
var uriOfImageOfCarToAdd;

function OnDocumentReady() 
{
	_serverApi = new serverApi();

	user_data_str = window.localStorage.getItem("user_data");
	user_data = null;
	if(user_data_str!=null) {
	    user_data = JSON.parse(user_data_str);
	}
    
	// are we running in native app or in browser?
	window.isphone = false;
    
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) 
	{
		window.isphone = true;
	} 

 

    if(window.isphone) 
    {
        document.addEventListener("deviceready", onDeviceReady, false);
    } 
    else 
    {
        onDeviceReady();
    }
}

function onDeviceReadyCamera() {
    
    //alert('onDeviceReadyCamera');
    cameraApp = new cameraApp();
    cameraApp.run();
}



// PhoneGap is ready
function onDeviceReady() 
{
	console.log("onDeviceReady");
	
	// remove back button functionality
	
	 document.addEventListener("backbutton", function(e){
		e.preventDefault();
		/*
	       if($.mobile.activePage.is('#homepage')){
		   e.preventDefault();
		   navigator.app.exitApp();
	       }
	       else 
	       {
		   navigator.app.backHistory()
	       }
	       */
	    }, false);
    	
	
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) 
	{
		onDeviceReadyCamera();
		getLocation();
    		navigator.splashscreen.hide();
	}
	else
	{
		$('#smallImage').click(function() 
		{
			console.log("desktop-click!!");
		        var smallImage = document.getElementById('smallImage');
			smallImage.style.display = 'block';
			// Show the captured photo.
			smallImage.src = "images/car123456.jpg";
			return false;
		});
	}
	
	// if user is already logged in - go direcly to home screen
	if (_serverApi.auth_token != null )
	{
	    console.log("(auth_token != null )");
	    //app.navigate("#home"); 
	}

} 
    

function id(element) 
{
    return document.getElementById(element);
}


// ===================// 
// camera stuff       //  
// ================== //
        

function cameraApp(){}

cameraApp.prototype =
{
        
    _pictureSource: null,
    _destinationType: null,

        
    run: function()
    {
      
        var that=this;
        console.log("cameraApp.run!!");
        
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) 
	{
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;
	    
		$('#smallImage').click(function() 
		{
			console.log("click!!");
			cameraApp._capturePhoto.apply(that,arguments);
			return false;
		});
	}
	else
	{

	}
          
    },
    _capturePhoto: function() {
		var that = this;
		// Take picture using device camera and retrieve image as base64-encoded string.
		navigator.camera.getPicture(function(){
            that._onPhotoURISuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 20,
            destinationType: that._destinationType.FILE_URI
        });
    },
   
    _capturePhotoEdit: function() {
        var that = this;
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
        // The allowEdit property has no effect on Android devices.
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        }, function(){
            that._onFail.apply(that,arguments);
        }, {
            quality: 20, allowEdit: true,
            destinationType: cameraApp._destinationType.DATA_URL
        });
    },
    
    _getPhotoFromLibrary: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);         
    },
    
    _getPhotoFromAlbum: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function(){
            that._onPhotoURISuccess.apply(that,arguments);
        }, function(){
            cameraApp._onFail.apply(that,arguments);
        }, {
            quality: 50,
            destinationType: cameraApp._destinationType.FILE_URI,
            sourceType: source
        });
    },
    
    _onPhotoDataSuccess: function(imageData) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
    
        // Show the captured photo.
        smallImage.src = "data:image/jpeg;base64," + imageData;
    },
    
    _onPhotoURISuccess: function(imageURI) {
 
        uriOfImageOfCarToAdd = imageURI;
        
        // keep the absolute path in this tag - this will be needed for the upload function at the modal close
        var smallImage_url = document.getElementById('smallImage_url');
        smallImage_url.style.display = 'block';
        smallImage_url.src = imageURI;

	// display the image ... 
        window.resolveLocalFileSystemURI(uriOfImageOfCarToAdd, cameraApp._onResolveSuccess, cameraApp._onFail);
    },
    
    _onFail: function(message) 
    {
        alert('Failed! Error: ' + message);
    },
    _onResolveSuccess: function(fileEntry) 
    {
	function win(file) 
	{
	    var reader = new FileReader();
	    reader.onloadend = function (evt) 
	    {
		console.log("read success");
		console.log(evt.target.result);
		
		var dataUri = evt.target.result;
        	var smallImage = document.getElementById('smallImage');
        	smallImage.style.display = 'block';
	        smallImage.src = dataUri;
	    };
	    reader.readAsDataURL(file);
	};

	var fail = function (evt) 
	{
	    console.log(error.code);
	};
	fileEntry.file(win, fail);
        console.log(fileEntry.name);
    }
}

// =======================
// SIGNI/UP UI CALLBACKS
// =======================


function settingsViewInit() 
{  

    console.log("settingsViewInit");
    /*
    $('#scanView').click(function() 
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
	
}
 
function beforeShowLogin(e) 
{
	console.log("beforeShowLogin");
	if (_serverApi.auth_token != null )
	{
	    console.log("(auth_token != null )");
	    app.navigate("#home"); 
	}
}

function afterShowSignin(e) 
{

	//window.localStorage.setItem("last_email_signin","alior101@gmail.com" );
	//window.localStorage.setItem("last_password_signin", "kellogskellogs");

	console.log(e.view);

	//var auth_token = window.localStorage.getItem("auth_token");
	console.log("auth_token = "+ _serverApi.auth_token);
	if (_serverApi.auth_token != null )
	{
	    console.log("(auth_token != null )");
	    app.navigate("#home"); 
	}
	else if (user_data!=null)
	{
	     document.getElementById("email-signin").value = user_data['user']['email']; // window.localStorage.getItem("last_email_signin");
	     document.getElementById("password-signin").value = user_data['user']['password']; //window.localStorage.getItem("last_password_signin");
	}
}

   
function closeViewSignIn() 
{
	app.showLoading();

	var email = $("#email-signin").val();
	var password = $("#password-signin").val();

	user_data = {user: {email: email, password: password} }
	user_data_str = JSON.stringify(user_data);
	window.localStorage.setItem("user_data",user_data_str);

	_serverApi.sign_in({
	    data: user_data,
	    success: function(response)  {
            //get the full user info and store locally
            _serverApi.get_user({
                success: function(response)  {
                    console.log('_serverApi.get_user: response' + response);
                    user_data = response;
                    user_data_str = JSON.stringify(user_data);
                    window.localStorage.setItem("user_data",user_data_str);
                },
                error: function(errorThrown)  {
                    console.log('_serverApi.get_user failed: ' + errorThrown);
                }
            });
            app.hideLoading();
            app.navigate("#home");
            console.log('navigate: ' + _serverApi.auth_token);
	    },
	    error: function(errorThrown)  {
            app.hideLoading();
            alert('Sign in failed');
            app.navigate("#login");
	    }
	});
}

 
function cancellViewSignIn() 
{
	app.navigate("#login");
}


    function closeViewSignUp() 
    {
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var phone = $("#phone").val();
        var credit_card_number = $("#credit_card_number").val();
        var id_card_number = $("#id_card_number").val();
        var email = $("#email-signup").val();
        var password = $("#password-signup").val();
        
        app.showLoading();

        //TODO: add phone and credit_card_number to server, add as accessible attr
        //, phone: phone, credit_card_number: credit_card_number, id_card_number: id_card_number
        user_data = {user: {email: email, password: password, password_confirmation: password, firstname: firstname, lastname: lastname } } 
        user_data_str = JSON.stringify(user_data);
        window.localStorage.setItem("user_data",user_data_str);

        _serverApi.sign_up({
            data: user_data,
            success: function(response)  {
                app.hideLoading();
                $("#modalview-signup").kendoMobileView("close");
                app.navigate("#modalview-addCar"); 
                app.navigate("#home");
            },
            error: function(errorThrown)  {
                app.hideLoading();
                alert('Signup Failed');
                app.navigate("#login");
            }
        });
    }
 
 
 
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
    
        
    function closeViewSignOut() 
    {
        console.log("closeViewSignOut");
        _serverApi.sign_out();
        app.navigate("#login");
        //app.navigate("../index.html");
    }
       
         
// =======================
// CAR MANAGEMENT CALLBACKS
// =======================
 
// CAR addition

         function win(r) 
         {
		 //console.log("Code = " + r.responseCode);
		 //console.log("Response = " + r.response);
		 console.log("Sent = " + r.bytesSent);
		 app.hideLoading();
         }

         function fail(error) {
		 console.log("An error has occurred: Code = " = error.code);
		 console.log("upload error source " + error.source);
		 console.log("upload error target " + error.target);
		 app.hideLoading();
         }
         
	function uploadPhoto(car_id, imageURI) 
	{
		 _serverApi.upload_car_image(car_id, imageURI, win, fail);
	}
	
	
    function closeModalAddCarCancel() 
    {
        console.log("closeModalAddCarCancel");
        $("#modalview-addCar").data("kendoMobileModalView").close();
    }
    

    
 
   function closeModalAddCar() 
    {
        console.log("closeModalAddCar");
	app.showLoading();
	var smallImage = document.getElementById('smallImage_url');
	var registration = $('#license_registration_number').val();
	var car_description = $('#car_description').val();
	var car_image_data = smallImage.src;
	var data = {car: {license_plate: registration, car_description: car_description}};
	
	_serverApi.add_cars({ data: data, 
		success: function(response) 
		{
			var car_id = response.id;
			//alert("uploadPhoto:"+car_image_data);
			uploadPhoto(car_id, car_image_data);
			//console.log(response);
			update_cars_list_from_server();
			if (localStorage.getItem("chosen_car") == "undefined")
			{
				localStorage.setItem("chosen_car",0); // this will be the default chosen car in case there is only one car
			}
			app.hideLoading();
			$("#modalview-addCar").data("kendoMobileModalView").close();	
		},
		error: function(error) 
		{
			console.log(error);
			app.hideLoading();
		}});
    }
         
// CAR delete
/*
	function prepare_car_to_delete_template()
	{
		var data = {};
		user_cars_str = window.localStorage.getItem("user_cars");
		if(user_cars_str!=null) 
		{
		    user_cars = JSON.parse(user_cars_str);
		}
		var result = template(data); //Execute the template
		$("#DeleteCarsListScrollerTemplateResults").html(result);
	}
*/

function init_del_car_view()
{

$('.icc').css({position:'absolute'});

	var v_left = ($(window).width() - $('.icc').outerWidth())/2;
	var v_top = ($(window).height() - $('.icc').outerHeight())/2;

	$('.icc').css({left: v_left});
	$('.icc').css({top: v_top});

	$('#DelCarsListScroller').mobiscroll('show');
}
    function closeDelCarCancel() 
    {
        console.log("closeDelCarCancel");
        app.navigate("#accountSettingsView");
    }
    function closeDelCar() 
    {
        console.log("closeDelCar");
        app.showLoading();
        var data = {car: { archive: true}};
        var car_ind = localStorage.getItem("chosen_car_to_delete");

        if(car_ind!=null) {
            _serverApi.update_cars({ id: cars_data[car_ind].ID, data: data,
                success: function(response)
                {
               
                    	// in success - update the car list in the storage
			update_cars_list_from_server();
			if (cars_data.length == 0)
			{
				localStorage.setItem("chosen_car", undefined);
			}
			else if (cars_data.length == 1)
			{
				localStorage.setItem("chosen_car", 0);
			}
			else
			{
				var chosen_car =  localStorage.getItem("chosen_car");
				if (chosen_car > car_ind) // lower index than the one chosen is deleted - got to update the index to reflect the right chosen one now that one weas deleted
				{
				        localStorage.setItem("chosen_car", chosen_car - 1);
				}
  			}	

			 
                    app.hideLoading();
                    app.navigate("#accountSettingsView");
                },
                error: function(error)
                {
                    console.log(error);
                    app.hideLoading();
                    app.navigate("#accountSettingsView");
                }});
        }
    }    

    
// =======================
// ACCOUNT MANAGEMENT CALLBACKS
// =======================
 
   
    function updateAccountDetails()
    {
        app.navigate("#view-update-account");
    }
    

//////////////////////////
// APP DAta             //
//////////////////////////

/*
var parkyAppData = function() {
	var _endpoints,
    	_initialCars,
    	_announcements,
        _private;

	_endpoints = {
		starbucksLocs: {path:"http://www.starbucks.com/api/location.ashx?&features=&lat={LAT}&long={LONG}&limit={MAX}", verb:"GET"},
		starbucksTest: {path:"scripts/testData/starbucksTest.json", verb:"GET"}
	};

	_private = {
		load: function(route, options) {
			var path = route.path,
    			verb = route.verb,
    			dfd = new $.Deferred();

			console.log("GETTING", path, verb, options);

			//Return cached data if available (and fresh)
			if (verb === "GET" && _private.checkCache(path) === true) {
				//Return cached data
				dfd.resolve(_private.getCache(path));
			}
			else {
				//Get fresh data
				$.ajax({
					type: verb,
					url: path,
					data: options,
					dataType: "json"
				}).success(function (data, code, xhr) {
					_private.setCache(path, {
						data: data,
						expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
					});
					dfd.resolve(data, code, xhr);
				}).error(function (e, r, m) {
					console.log("ERROR", e, r, m);
					dfd.reject(m);
				});
			}

			return dfd.promise();
		},
        
		checkCache: function(path) {
			var data,
			path = JSON.stringify(path);

			try {
				data = JSON.parse(localStorage.getItem(path));
                
				if (data === null || data.expires <= new Date().getTime()) {
					console.log("CACHE EMPTY", path);
					return false;
				}
			}
			catch (err) {
				console.log("CACHE CHECK ERROR", err);
				return false;
			}

			console.log("CACHE CHECK", true, path);
			return true;
		},
        
		setCache: function(path, data, expires) {
			var cache = {
				data: data,
				expires: expires
			},
			path = JSON.stringify(path);

			//TODO: Serialize JSON object to string
			localStorage.setItem(path, JSON.stringify(cache));

			console.log("CACHE SET", cache, new Date(expires), path);
		},
        
		getCache: function(path) {
			var path = JSON.stringify(path),
			cache = JSON.parse(localStorage.getItem(path));

			console.log("LOADING FROM CACHE", cache, path);

			//TODO: Deserialize JSON string
			return cache.data.data;
		},
        
        signin: function(email, password)
        {
                //Get fresh data
				$.ajax({
					type: 'POST',
					url: 'http://localhost:3000/users.json',
					data: '{"user":{"email":"email@gmail.com", "password":"pass"}}',
					dataType: "json"
				}).success(function (data, code, xhr) {
					_private.setCache(path, {
						data: data,
						expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
					});
					dfd.resolve(data, code, xhr);
				}).error(function (e, r, m) {
					console.log("ERROR", e, r, m);
					dfd.reject(m);
				});
        }
	};

	return {
		getParkingsLocations: function(lat, lng, max) {
			var route = $.extend({}, _endpoints.starbucksLocs);

			route.path = route.path.replace(/{LAT}/g, lat);
			route.path = route.path.replace(/{LONG}/g, lng);
			route.path = route.path.replace(/{MAX}/g, max || 10);

			if (document.location.hostname === "parking") {
				//Test environment (localhost) - fake response
				route = $.extend({}, _endpoints.starbucksTest);
			}

			return _private.load(route, {});
		},
        
		getInitialCars: function() {
			return JSON.stringify(_initialCars);
		},
        
		getAnnouncements: function() {
			return _announcements;
		}
	};
}
*/


    var cars_data;
    var regions_data;
    var done_with_cars_from_server;
    var done_with_regions_from_server;
    
    
    function digitized() 
    {
		var dt = new Date();    // DATE() CONSTRUCTOR FOR CURRENT SYSTEM DATE AND TIME.
		var lt = new Date(localStorage.getItem("ParkingStartTime"));
		var t2 = dt.getTime();
		var t1 = lt.getTime();
		
		var dys = parseInt((t2 - t1) / (24 * 3600 * 1000));
		var hrs = parseInt((t2 - t1) / (3600 * 1000) % 24);
		var min = parseInt((t2 - t1) / (60 * 1000) % 60);
		var sec = parseInt((t2 - t1) / 1000 % 60);
		
		/*
		var hrs = dt.getHours();
		var min = dt.getMinutes();
		var sec = dt.getSeconds();
		*/
		min = Ticking(min);
		sec = Ticking(sec);
		
		//var el1 = document.getElementById('dc');
		var el1 = document.getElementById('parking_selection_item-title');
		
		if (ParkingActive) {
			el1.innerHTML = hrs + ":" + min + ":" + sec; 
			//document.getElementById('dc_second').innerHTML = sec;
			var rate = localStorage.getItem("chosen_region_rate");
			document.getElementById('parking_selection_item-info').innerHTML = parseInt(sec * rate ) + '$';   
			//document.getElementById('cost').innerHTML = parseInt( sec * rate / 3600)+'$';        
		}

		var time;
		
		// THE ALL IMPORTANT PRE DEFINED JAVASCRIPT METHOD.
		if (ParkingActive) {
			time = setTimeout('digitized()', 1000);      
		}
	}
	
	function Ticking(ticVal) {
		if (ticVal < 10) {
			ticVal = "0" + ticVal;
		}
		return ticVal;
	}
	
	function homeBeforShow(e) {
		console.log(e.view);
	}
	
    
    function handle_parking_panel()
    {
        
        var status = localStorage.getItem("ParkingActive");
	if (status == 1)
        {
			ParkingActive = true;
			digitized();
			document.getElementById('parking_selection_item-title').innerHTML = 'Active';
			return false;
	}
	else 
        {
			ParkingActive = false;
			localStorage.setItem("ParkingActive", "0");
			console.log('parking stoped');
			document.getElementById('parking_selection_item-title').innerHTML = 'Start';
			document.getElementById('parking_selection_item-info').innerHTML = '';
			return false;  
	}
    } 
    
    function set_up_cars_scrollers()
    {
    
	     	/* ===================== */
	    	/* CAR SELECTION SCROLER */
	    	/* ===================== */
	    	
           	var template = kendo.template($("#CarsListScrollerTemplate").html());        
		var result = template({data:cars_data}); //Execute the template  
        	$("#CarsListScrollerTemplateResults").html(result);
		
        	// do the same for the list of cars to e deleted - inside there is the tag #DelCarsListScroller which is being shown 
        	// when the relvant view is navigated to 
       		template = kendo.template($("#DelCarsListScrollerTemplate").html());        
		result = template({data:cars_data}); //Execute the template  
        	$("#DelCarsListScrollerTemplateResults").html(result);
 
		/* this will put on the home screen the last chosen car*/
		pid = localStorage.getItem("chosen_car");
    
		if (cars_data.length > 0) // there is at least one car 
        	{
			if (pid == "undefined" || pid == null)
			{
				// just put something there - the first one will do
				document.getElementById("car_selection_item_title").innerHTML = cars_data[0].registration;
				document.getElementById("car_selection_item_description").innerHTML = cars_data[0].Name;
				localStorage.setItem("chosen_car", 0);
			}
			else
			{
				document.getElementById("car_selection_item_title").innerHTML = cars_data[pid].registration;
				document.getElementById("car_selection_item_description").innerHTML = cars_data[pid].Name;
			}
		}
		else 
       		{
			document.getElementById("car_selection_item_title").innerHTML = "No Car"
			document.getElementById("car_selection_item_description").innerHTML = "registered yet...";
		}
        
        	if (cars_data.length > 0)
        	{
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
					if (v != undefined)
					{
						$("#car_selection_item_title").html(cars_data[v[0]].registration);
						$("#car_selection_item_description").html(cars_data[v[0]].Name);
						/* save the car selected in persistent storage */
						localStorage.setItem("chosen_car", v[0]);
					}
				},
			});
	     
			$('#DelCarsListScroller').mobiscroll().image({
				theme: 'android',
				display: 'inline',
				mode: 'scroller',
				labels: ['Car'],
				inputClass: 'i-txt',
				onSelect: function (v, inst) 
				{
				},
				onChange: function (v, inst) 
				{
					if (v != 'undefined')
					{
						localStorage.setItem("chosen_car_to_delete", v[0]);
					}
				
				},
			});	

		
			$('#car_selection').click(function() 
			{      
				status = localStorage.getItem("ParkingActive");
				if (status == 0) // allow car selection only if parking is inactive
				{
					if (cars_data.length>0)
					{           
			    			if (cars_data[pid] != null) 
					    	{
				    			$('#CarsListScroller').mobiscroll('setValue', [pid, cars_data[pid].registration , cars_data[pid].PictureUrl ], true, .2);    
				    		}
		    	    			$('#CarsListScroller').mobiscroll('show');
		    	    		}
		    	    	}
				return false;
			});
		}
		else // no cars, no scroller and no click option ... 
		{
			localStorage.setItem("chosen_car",undefined);
		}
		
    }
    function get_rate_at_current_time(rate_array)
    {
	var d = new Date();
    	var day = d.getDay();
    	var hours = d.getHours();
    	var minutes = d.getMinutes();
    	var rate = 0;
    	var time = parseInt(hours.toString()+minutes.toString());
    	for (i = 0; i < rate_array.length; i++)
    	{
    		if ((rate_array[i].day_a_week == day) && (time > rate_array[i].start_time_int) && (time <= rate_array[i].end_time_int))
		{
			rate = rate_array[i].rate;
		}
    	}
    	return rate;
    }
    function set_up_regions_scrollers()
    {
    
		/* ======================== */
		/* REGION SELECTION SCROLER */
		/* ======================== */
	
		var regions_template = kendo.template($("#RegionsListScrollerTemplate").html());
		result = regions_template(regions_data); //Execute the template
 
 		$("#RegionsListScrollerTemplateResults").html(result);
		pid1 = localStorage.getItem("chosen_region_city");
		pid2 = localStorage.getItem("chosen_region_suburb");
		
		$('#RegionsListScroller').mobiscroll().treelist({
			theme: 'android',
			display: 'modal',
			mode: 'scroller',
			labels: ['City', 'Suburb'],
			inputClass: 'i-txt',
			setText: 'OK',
			onSelect: function (v, inst) {
			},
			onChange: function (v, inst) {
				$("#region_selection_item_title").html(regions_data[inst.temp[0]].areas[inst.temp[1]].name + ", " + regions_data[inst.temp[0]].name);
				localStorage.setItem("chosen_region_city", inst.temp[0]);
				localStorage.setItem("chosen_region_suburb", inst.temp[1]);
				rate_array = regions_data[inst.temp[0]].areas[inst.temp[1]].rates;
				rate = get_rate_at_current_time(rate_array);
				localStorage.setItem("chosen_region_rate", rate);
				$("#region_selection_item_description").html(rate + "$/h");
			}
		}); 
		
		// this is the predefined values when the screen first show up 
		if ((pid1 != null) && (pid2 != null)) {
			$("#region_selection_item_title").html(regions_data[pid1].areas[pid2].name + ", " + regions_data[pid1].name);
			//$("#region_selection_item_title").html(pid2 + ", " + pid1);
			$('#RegionsListScroller').mobiscroll('setValue', [pid1, pid2 ], true, .2);
			var rate_array = regions_data[pid1].areas[pid2].rates;
			var rate = get_rate_at_current_time(rate_array); 
			localStorage.setItem("chosen_region_rate", rate);
			$("#region_selection_item_description").html(rate + "$/h");
		}

        
        $('#region_selection').click(function() 
        {
		status = localStorage.getItem("ParkingActive");
		if (status == 0) // allow car selection only if parking is inactive
		{
	   		var result = regions_template(regions_data); //Execute the template
	    		// console.log(result);
	    		$("#RegionsListScrollerTemplateResults").html(result);
	    		$('#RegionsListScroller').mobiscroll('show');
	    	}
    		return false;
    	});
    }

    function update_regions_and_rates_from_server()
    {
        _serverApi.get_rates({
            success: function(response) {
                if(response!=null) {
                    localStorage.setItem('cities_data', JSON.stringify(response) );
                    regions_data = JSON.parse(localStorage.getItem('cities_data'));
                    set_up_regions_scrollers();
                    done_with_regions_from_server  = true;
                    app.hideLoading();
                } else {
                    console.log('Empty rates list received');
                    app.hideLoading();
                }
            },
            error: function(error)
            {
                console.log(error);
                app.hideLoading();
                alert('Failed fetching rates');
            }
        });
    }

    function update_cars_list_from_server()
    {
        _serverApi.get_cars({
        success: function(response) {
            if(response!=null){
                console.log(response);
                _cars_data = response; //JSON.stringify(response);

                var jsonObj = [];
                var i = 0;
                var index = 0;
                for (i= 0; i< response.length; i++)
                {
                    if ( response[i].archive == false ) // keep only undelete cars
                    {
                        jsonObj.push({
                            "index": index,
                            "ID": response[i].id,
                            "registration": response[i].license_plate,
                            "PictureUrl": "http://"+response[i].image_url,
                            "Name": response[i].car_description});
                        index++; // index of archived cars is not incremented
                    }
                }
                localStorage.setItem('cars_data', JSON.stringify(jsonObj) );
                cars_data = JSON.parse(localStorage.getItem('cars_data'));
                if (cars_data == null)
                {
                    cars_data = [];
                }
                set_up_cars_scrollers();
                done_with_cars_from_server  = true;
                if (done_with_regions_from_server)
                {
                    app.hideLoading();
                }
            } else {
                console.log('Empty car list received');
                app.hideLoading();
            }
        },
        error: function(error)
        {
            console.log(error);
            app.hideLoading();
        }});
    }
    
    
    // this is called ONLY ONCE before the firt time the home screen is shown
    function init_home_view()  
    {
	 
         	console.log("calling init_home_view");   
         	
 
         	user_data = JSON.parse(localStorage.getItem('user_data'));
         	user_id = user_data.user.id;
         	
		done_with_cars_from_server = false;
		done_with_regions_from_server = false;
  
       		app.showLoading();
       		
       		update_cars_list_from_server();
       		update_regions_and_rates_from_server();
       		
          	handle_parking_panel();
		

      
    	// ======================== 
    	// PARKING SELECTION SCROLER 
    	// ======================== 
    
        
    	$('#parking_selection').click(function() 
        {
    	
    		//debugger;
    	    	status = localStorage.getItem("ParkingActive");
    	    	var chosen_car = localStorage.getItem("chosen_car");
    		pid1 = localStorage.getItem("chosen_region_city");
    		pid2 = localStorage.getItem("chosen_region_suburb");
    		if ((chosen_car == "undefined") || (pid1 == null) || (pid2 == null)) 
            	{
    			alert("Please set the car and the location first");
    			return false;
    		}
    		 
             	pid  = 	cars_data[chosen_car].ID;
   		status = localStorage.getItem("ParkingActive");
   		var dt = new Date(); 
    		if ((status == null) || (status == 0)) 
            	{
    			
    			start_payment(dt);
     			return false;
    		}
    		else 
            	{
	            	stop_payment(dt);
      			return false;  
    		}
    		
    		if ((localStorage.getItem("ParkingActive") == undefined) || (localStorage.getItem("ParkingActive") == "0")) 
            	{
    			document.getElementById('parking_selection_item-title').innerHTML = 'Start';
    			ParkingActive = false;
    		}
    		else 
            	{
    			ParkingActive = true;
    		}
            
    		if (ParkingActive) 
           	{
    			digitized();
    		} 
        });	
}

   function start_payment(start_time)
    {
	var x_pos = 0;
	var y_pos = 0;
	
	app.showLoading();
	

	var rate_id = parseInt(localStorage.getItem("chosen_region_rate"),10);
	var area_id = parseInt(localStorage.getItem("chosen_region_suburb"),10);
	
	var data = {payment: { x_pos: x_pos, y_pos: y_pos, area_id: area_id, rate_id: rate_id, user_id: user_data.user.id, start_time: start_time}};
	_serverApi.add_payment({
			data: data, 
			success: function(response) {
				console.log(response);
				localStorage.setItem("payment_id", response.id);
	   			ParkingActive = true;
	    			localStorage.setItem("ParkingActive", "1");
	    			localStorage.setItem("ParkingStartTime", dt);
	    			digitized();
	    			console.log('parking started');
	    			document.getElementById('parking_selection_item-title').innerHTML = 'Starting...';
				app.hideLoading();
			},
			error: function(error) 
			{
				app.hideLoading();
				console.log(error);
				localStorage.setItem("payment_id", -1);
			}});

    }
    
    function stop_payment(end_time)
    {
  	    app.showLoading();
	    var payment_id = localStorage.getItem("payment_id");
	    var data = { payment: { id: payment_id, end_time: end_time}}
	    _serverApi.update_payment({ 
			data: data, 
			success: function(response) 
			{
				console.log(response);
	    			ParkingActive = false;
	    			localStorage.setItem("ParkingActive", "0");
	    			console.log('parking stoped');
	    			document.getElementById('parking_selection_item-title').innerHTML = 'Start';
	    			document.getElementById('parking_selection_item-info').innerHTML = '';
 				app.hideLoading();
			},
			error: function(error) 
			{
				console.log(error);
				app.hideLoading();
			}});

    }

	
