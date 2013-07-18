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

// GENERAL UI CALLBACKS
// ===================

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
	    app.navigate("views/homeView.html"); 
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
		app.hideLoading();
		app.navigate("views/homeView.html");
		//app.navigate("#start");
		console.log('navigate: ' + _serverApi.auth_token);
	    },
	    error: function(errorThrown)  {
		app.hideLoading();
		alert('Sign in failed');
		app.navigate("#login");
	    }
	});
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
        user_data = {user: {email: email, password: password, password_confirmation: password, firstname: firstname, lastname: lastname } } //, phone: phone, credit_card_number: credit_card_number, id_card_number: id_card_number
        user_data_str = JSON.stringify(user_data);
        window.localStorage.setItem("user_data",user_data_str);

        _serverApi.sign_up({
            data: user_data,
            success: function(response)  {
                app.hideLoading();
                $("#modalview-signup").kendoMobileView("close");
                app.navigate("views/homeView.html");
            },
            error: function(errorThrown)  {
                app.hideLoading();
                alert('Signup Failed');
                app.navigate("#login");
            }
        });
    }
 
 
     function closeModalAddCarCancel() 
    {
        console.log("closeModalAddCarCancel");
        $("#modalview-addCar").data("kendoMobileModalView").close();
    }
    
    function chooseCarToDelete() 
    {                 
        console.log("chooseCarToDelete");
	    $('#CarsListScroller').mobiscroll('show');
        // ofer delete the car denoted by chosen car in the local storage 
		return false;
	}
    
    function updateAccountDetails()
    {
        app.navigate("#view-update-account");
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
       
         function win(r) 
         {
		 console.log("Code = " + r.responseCode);
		 console.log("Response = " + r.response);
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
			app.hideLoading();
			$("#modalview-addCar").data("kendoMobileModalView").close();	
		},
		error: function(error) 
		{
			console.log(error);
			app.hideLoading();
		}});
    }
         
 function settingsViewInit() 
 {  

    console.log("settingsViewInit");
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


 }
    
//////////////////////////
// APP DAta             //
//////////////////////////

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
            /*
            curl -H "Accept: application/json" -H "Content-type: application/json" 
            -X POST -d '{"user":{"email":"email@gmail.com", "password":"pass"}}' 
            'http://localhost:3000/users.json
            */
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
