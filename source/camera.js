// JavaScript Document


// ===================// 
// camera stuff       //  
// ================== //

function onDeviceReadyCamera() 
{    
    //console.log("aonDeviceReadyCamera");
    cameraApp = new cameraApp();
    cameraApp.run();
}        

function cameraApp(){}

cameraApp.prototype =
{
        
    _pictureSource: null,
    _destinationType: null,

        
    run: function()
    {
        var that=this;
        //console.log("cameraApp.run!!");
        that._pictureSource = navigator.camera.PictureSourceType;
        that._destinationType = navigator.camera.DestinationType;
    },
    _capturePhoto: function() 
    {
        var that = this;
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function(){
                that._onPhotoURISuccess.apply(that,arguments);
            },function(){
                that._onFail.apply(that,arguments);
            },{
                quality: 70,
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
            quality: 70, allowEdit: true,
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
            quality: 70,
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
    
    _onPhotoURISuccess: function(imageURI) 
    {
 
 	      //console.log("inside onPhotoURISuccess");
        uriOfImageOfCarToAdd = imageURI;
        
        var smallImage_url = document.getElementById('smallImage');
        smallImage_url.style.display = 'block';
        smallImage_url.src = imageURI;

        // keep the absolute path in this tag - this will be needed for the upload function at the modal close
        var smallImage_name = document.getElementById('smallImage_url');
        smallImage_name.src = imageURI;

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

