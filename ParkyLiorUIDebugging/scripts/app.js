// JavaScript Document


 
function id(element) {
    return document.getElementById(element);
}


// ===================// 
// camera stuff       //  
// ================== //


function onDeviceReadyCamera() {
    
	//InitUI();
    cameraApp = new cameraApp();
    cameraApp.run();
}


function cameraApp(){}

cameraApp.prototype=
    {
        
    _pictureSource: null,
    
    _destinationType: null,

     
        
    run: function(){
      
        var that=this;
        
	    that._pictureSource = navigator.camera.PictureSourceType;
	    that._destinationType = navigator.camera.DestinationType;
/*
	    document.getElementById("photoButton").addEventListener("click", 
                function(){ that._capturePhoto.apply(that,arguments);});
*/        
	          
         $('#smallImage').click(function() {
                /*
                  console.log("click!!");
                alert('bubu');
                 */
                that._capturePhoto.apply(that,arguments);
             
				return false;
			});
    },
    
    _capturePhoto: function() {
        var that = this;
        /* alert("YEAYEA!!"); */
        /* Take picture using device camera and retrieve image as base64-encoded string. */
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 50,
            destinationType: that._destinationType.DATA_URL
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
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
         
        // Show the captured photo.
        smallImage.src = imageURI;
    },
    
    _onFail: function(message) {
        alert('Failed! Error: ' + message);
    }
} 
    

// =============================// 
// cars list scroiller stuff    //  
// ============================ //

function initPictureView(e) 
{
    /*
    $.ajax({
       url: '/echo/json/',
       type: "POST",
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       data: {
            json: JSON.stringify([
                { PictureUrl: "class1" }, 
                { PictureUrl: "class2" }
            ]),
            delay: 1
        },
        success: function(response) {
            console.log(response);
            var template = kendo.template($("#PictureTemplate").html()),
                content = kendo.render(template, response);
            
            $("#PictureView")
                .kendoMobileScrollView()
                    .data("kendoMobileScrollView")
                        .content("<!--" + content + "-->");
        }
    });
    */
    
    /*
    $.get("test.php", { name: "John", time: "2pm" })
        .done(function(data) {
          response = data;
        });
    */          
    
/*
    var response = [{ PictureUrl: "https://dl.dropboxusercontent.com/u/1495669/car2.png"},
                    { PictureUrl: "https://dl.dropboxusercontent.com/u/1495669/car1.png"}];
    var template = kendo.template($("#PictureTemplate").html()), content = kendo.render(template, response);
    //console.log(content);   
    //alert('$content');
    $("#PictureView")
        .kendoMobileScrollView()
           .data("kendoMobileScrollView")
           .content("<!--" + content + "-->");
*/
    
    /*     
           explanation:
           ------------
           #CarsListScrollerTemplateResults - is the tag in the HTML that is replaces with the processtemplate - locted at the respect div
           #CarsListScrollerTemplate - is the template itself and is located in the root dom 
    */
    /*
    var response = [{ PictureUrl: "https://dl.dropboxusercontent.com/u/1495669/car2.png"},
                    { PictureUrl: "https://dl.dropboxusercontent.com/u/1495669/car1.png"}];
    var template = kendo.template($("#CarsListScrollerTemplate").html());
    var content = kendo.render(template, response);
    console.log(content);   
    //alert('$content');
    $("#CarsListScrollerTemplateResults").content("<!--"+content+"-->");
    */

}


///////////////////////////
//  CAR MANAGEMENT STUFF //
///////////////////////////

///////////////////////////
//  SETTINGS RELATED STUFF //
///////////////////////////


function closeModalAddCar() 
{
    $("#modalview-addCar").kendoMobileModalView("close");
}

function closeModalViewCancel() 
{
        $("#modalview-signup").kendoMobileModalView("close");
        $("#modalview-signin").kendoMobileModalView("close");
}
    
        
function closeModalViewSignUp() 
{
    /* OFER put here AJAX to do SIGNIN */        
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var phone = $("#phone").val();
    var credit_card_number = $("#credit_card_number").val();
    var email = $("#email").val();
    var password = $("#password").val();
    
    //TODO: add phone and credit_card_number to server, add as accessible attr
    var jsonUser = {user: {email: email, password: password, password_confirmation: password, firstname: firstname, lastname: lastname } } //, phone: phone, credit_card_number: credit_card_number
    
    $.ajax({
		url: "http://54.­252.­87.­58:­3000/users.json",
		dataType: "json",
		type: "post",
		cache: false,
		data: jsonUser,
		success: function(response) 
        {
            console.log(response);
            $("#modalview-signup").kendoMobileModalView("close");
		},
		error: function(jqXHR, textStatus, errorThrown) 
        {
			console.log(jqXHR, textStatus, errorThrown);
            alert('Signup Failed');
	   }
	});
    
}
$('#scanview').click(function() 
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
    /*
    _initialCars = [
		{
			"carID":"12",			
            "carNumber":"1234567",
			"registerDate":"2013/12/06",
            "parkingActive":"1"
		},
        {
			"carID":"412",			
			"carNumber":"2132436",
			"registerDate":"2014/10/16",
            "parkingActive":"0"
		}
	];
    
	_announcements = [
		{ title: "Holiday Drinks Are Here", description: "Enjoy your favorite holiday drinks, like Pumpkin Spice Lattes.", url: "images/holiday.png" },
		{ title: "Register & Get Free Drinks", description: "Register any Jitterz card and start earning rewards like free drinks. Sign-up now.", url: "images/rewards.png" },
		{ title: "Cheers to Another Year", description: "Raise a cup of bold and spicy Jitterz Anniversary Blend.", url: "images/cheers.png" },
		{ title: "Hot Drinks Anytime", description: "Find and enjoy our, hot drinks anytime.", url: "images/hot-drink.png" },
		{ title: "Friend and Love", description: "Get more for your friends.Get Love.", url: "images/love-friend.png" },
		{ title: "Wide range of choice", description: "Raise a cup of bold and spicy Jitterz Anniversary Blend.", url: "images/best-coffee.png" }
	];
    */
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