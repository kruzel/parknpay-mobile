var _serverApi;
var user_data_str;
var user_data;
var cities_data;
var gParkingActive;
var uriOfImageOfCarToAdd;
var cars_data;
var done_with_cars_from_server;
var done_with_regions_from_server;
var use_geolocation = false;
var geolocation_result;  
var auto_login = false;
var app_initialized = false;
var car_assets_url = [];
var cities_array = [];
var suburbs_array = [];
var gimageURI;
var chosen_car;
var lastParkingPOIValid = false;

enyo.kind({
	name: "App",
	kind: "FittableRows",
	fit: true,
	classes: "enyo-fit",
	handlers: {
    		onload: "loadHandler",
            onbackbutton: "backButtonHandler"
	},
	baseUrl:"http://ozpark.com.au",
	components:[
		{kind: "Signals", ondeviceready: "deviceReady"},
		{kind: "Panels", name:"appPanels", fit:true, realtimeFit: false, draggable: false, animate:false, classes: "panels-sample-panels enyo-border-box",
			style:"background-image:  url(assets/1.png);	background-size: cover;	background-repeat: repeat;color:white;", components: [
			{content:0, name:"login_pannel", fit: true, components:[
					
					{kind:"Panels",name:"loginPanels",style:"height:100%;", fit:true, animate:false, realtimeFit:true,draggable:false,
									classes:"panels-sample-panels enyo-border-box",components: [
					
						/*
						=======================================
						===          WELCOME SCREEN         ===
						=======================================
						*/
						{content:0, name:"login_buttons_pannel", components:[
                            
							{classes: "fittable-transparent",  name:"logo_container", style:"height:50%;position:relative;top:0%;z-index:0;",components: [	
                                {kind: "Image", name:"logo", src: "assets/logo1.png", style:"height:100%; display: block;margin-left: auto;   margin-right: auto"},
							]},											 

							{classes: "fittable-transparent", fit: true, name:"login_container", style:"height:50%;position:relative;z-index:0;",components: [	

								{tag:"br"},{tag:"br"},
								{kind:"onyx.Button", content:"Login",
										style:"position:relative;left:10%;height:20%;width:80%;top:60%;background-color:purple;color:#F1F1F1;", ontap:"loginOnTap"},
								{tag:"br"},{tag:"br"},
								{kind:"onyx.Button", content:"Sign-Up",
										style:"position:relative;left:10%;height:20%;width:80%;top:10%;background-color:purple;color:#F1F1F1;",	ontap:"signupOnTap"},	
							]},
						
						]},
					
						/*
						=======================================
						===          LOGIN SCREEN         ===
						=======================================
						*/
						{content:1, name:"login_inputs_pannel",  components:[

								{tag:"br"},{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;", components: [
									{kind: "onyx.GroupboxHeader", content: "UserID"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"userid", placeholder: "User ID", style:"color:white;"}
									]}
								]},
								{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;",  components: [
									{kind: "onyx.GroupboxHeader", content: "Password"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"userpass", type: "password", style: "width: 80%;color:white;", 
														placeholder: "Password"}
									]}
								]},
								{tag:"br"},
								
								{ style: "position:relative;width:80%;left:10%;", 	 components: [
									{kind: "onyx.Button", content: "Login", style:"width:50%;background-color:purple;color:#F1F1F1;",
											ontap:"loginButtonOnTap"},
									{kind: "onyx.Button", content: "Cancel", style:"width:50%;background-color:purple;color:#F1F1F1;",
											ontap:"loginCancelOnTap"}
								]},
								{name: "spinnerPopup", classes: "onyx-spinner-popup", kind: "onyx.Popup", autoDismiss: false, centered: true, 
													floating: true, onHide: "popupHidden", scrim: true, components: [
									{kind: "onyx.Spinner"},
									{name:"spinnerPopupContent", content: "Connecting..."}
								]},

						]},
					
						/*
						=======================================
						===          SIGN-UP SCREEN         ===
						=======================================
						*/
						{content:2, name:"signup_inputs_pannel",  components:[
		
								{tag:"br"},{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;", components: [
									{kind: "onyx.GroupboxHeader", content: "Name"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"firstname", style:"color:white;", placeholder: "First Name"}
									]},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"lastname", style: "width: 80%;color:white;", 
														placeholder: "Last Name"}
									]}
								]},
								{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;",  components: [
									{kind: "onyx.GroupboxHeader", content: "Credit Card"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"credit_card_number", style: "width: 80%;color:white;", 
														placeholder: "Creadit Card Number"}
									]},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"id_card_number", style: "width: 80%;color:white;", 
														placeholder: "ID Number"}
									]},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"phone",  style: "width: 80%;color:white;", 
														placeholder: "Phone"}
									]}
								]},
								{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;",  components: [
									{kind: "onyx.GroupboxHeader", content: "User"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"email_signup", style: "width: 80%;color:white;", 
														placeholder: "Email"}
									]},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"password_signup",type: "password", style: "width: 80%;color:white;", 
														placeholder: "Password (8 chars min)"}
									]}
								]},
								{tag:"br"},
								
								{ style: "position:relative;width:80%;left:10%;", 	 components: [
									{kind: "onyx.Button", content: "Sign Up", style:"width:50%;background-color:purple;color:#F1F1F1;",
											ontap:"signupButtonOnTap"},
									{kind: "onyx.Button", content: "Cancel", style:"width:50%;background-color:purple;color:#F1F1F1;",
											ontap:"loginCancelOnTap"}
								]},

						]},
						/*
						=======================================
						===     UPDATE ACCOUNT SCREEN        ===
						=======================================
						*/
						{content:3, name:"update_account_inputs_pannel",  components:[
		
								{tag:"br"},{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;", components: [
									{kind: "onyx.GroupboxHeader", content: "Name"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"update_firstname", style:"color:white;", placeholder: "First Name"}
									]},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"update_lastname", style: "width: 80%;color:white;", 
														placeholder: "Last Name"}
									]}
								]},
								{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;",  components: [
									{kind: "onyx.GroupboxHeader", content: "Credit Card"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"update_credit_card_number", style: "width: 80%;color:white;", 
														placeholder: "Creadit Card Number"}
									]},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"update_id_card_number", style: "width: 80%;color:white;", 
														placeholder: "ID Number"}
									]},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"update_phone",  style: "width: 80%;color:white;", 
														placeholder: "Phone"}
									]}
								]},
								{tag:"br"},
								{kind: "onyx.Groupbox", style: "position:relative;width:80%;left:10%;",  components: [
									{kind: "onyx.GroupboxHeader", content: "User"},
									{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
										{kind: "onyx.Input", name:"update_password_signup",type: "password", style: "width: 80%;color:white;", 
														placeholder: "Password (8 chars min)"}
									]}
								]},
								{tag:"br"},
								
								{ style: "position:relative;width:80%;left:10%;", 	 components: [
									{kind: "onyx.Button", content: "Update", style:"width:50%;background-color:purple;color:#F1F1F1;",
											ontap:"updateAcountButtonOnTap"},
									{kind: "onyx.Button", content: "Cancel", style:"width:50%;background-color:purple;color:#F1F1F1;",
											ontap:"updateAccountCancelOnTap"}
								]},

						]},
										
					]},
					
				
			]},
			/*
			=======================================
			===          HOME PANNEL            ===
			=======================================
			*/
			{content:1, name:"home_pannel", components: [
				{kind: "onyx.Toolbar", name:"title", content: "ParkNPay", style:"height:5%;"},
				{kind: "FittableRows", fit: true, classes: "fittable-transparent",  components: [
					{classes: "fittable-transparent", name:"car_container", 
							ontap: "CarSelectTap", style:"height:33%;position:relative;z-index:0;",components: [	
						{kind: "Image", name:"car", src: "assets/car.png"},
						{name:"selected_car", content:"Parking car"}					
					]},
					{classes: "fittable-transparent",  name:"poi_container", 
							ontap: "RegionSelectTap", style: "height:33%;position:relative;z-index:0;", components: [
						{kind: "Image", name:"poi", src: "assets/poi.png"},
						{name:"selected_poi", content:"Parking area"},
					]},
					{classes: "fittable-transparent", name:"action_container", 
							ontap: "ActionSelectTap", style: "height:33%;position:relative;z-index:0;", components: [
						{kind: "Image", name:"action", src: "assets/p.png"},
						{name:"selected_action", content:"Press to start"}
					]}
				]},
				{kind: "Pullout", classes: "pullout"},
                {name: "homeSpinnerPopup", classes: "onyx-spinner-popup", kind: "onyx.Popup", autoDismiss: false, centered: true, 
													floating: true, onHide: "popupHidden", scrim: true, components: [
					{kind: "onyx.Spinner"},
					{name:"homeSpinnerPopupContent", content: "Connecting..."}
                ]},
		      {kind: "Notification", name: "notif"},

			]},
			/*
			=======================================
			===          ADD CAR PAGE           ===
			=======================================
			*/
			{content:2, name:"add_car_pannel", components: [
				{style:"position:relative;width:80%;left:10%;top:2%;", components: [
					{tag:"br"},
					{kind: "onyx.Groupbox", style: "position:relative;width:100%;", components: [
						{kind: "onyx.GroupboxHeader", content: "Registration number"},
						{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
							{kind: "onyx.Input", name:"regnum",  placeholder: "Registration Number", style:"color:white;"}
						]}
					]},
					{kind: "onyx.Groupbox", style: "position:relative;width:100%;",  components: [
						{kind: "onyx.GroupboxHeader", content: "Description"},
						{kind: "onyx.InputDecorator", style:"background-color:rgba(255, 255, 255, 0);", components: [
							{kind: "onyx.Input", name:"description",  placeholder: "Description" , style:"color:white;"}
						]}
					]},
					{tag:"br"},
					{kind: "Image", name:"carImage", style:"width:100%;height:50%;", src: "assets/car.png"},
					{tag:"br"},
					{kind:"onyx.Button", fit:true, style:"width:100%;", content: "Photo", ontap:"takePhotoOnTap"},
					{tag: "br"},
					{kind: "onyx.Button", style:"width:50%;height:15%;margin-top:5%;", content: "Cancel", ontap: "cancelAddCarOnTap"},
					{kind: "onyx.Button", style:"width:50%;height:15%;margin-top:5%;", content: "Add", ontap: "addACarOnTap"}
				]}
			]},
			/*
			=======================================
			===          PARKING  POI           ===
			=======================================
			*/
			{content:3, name:"parking_poi_pannel", components: [				
				
				{kind: "FittableRows", classes: "enyo-fit", components: [
			    		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
							{content: "Parking place", fit:true},
							{kind: "onyx.Button", content: "Done", ontap: "closePOIMap"},
			    		]},
			    		// BING - MAP 
			    		/*
						{name: "bing_map", kind: "BingMap", fit: true, onLoaded: "findCurrentLocation",
									options: {showDashboard: false, showScalebar: false},
									credentials: "Ah2oavKf-raTJYVgMxnxJg9E2E2_53Wb3jz2lD4N415EFSKwFlhlMe9U2dJpMZyJ"
						},
						*/
						{name: "google_map", kind: "GoogleMap", fit:true, onLoaded: "findCurrentLocation",
									options: {showDashboard: false, showScalebar: false},
									credentials: ""
						},
						
						
						// OPEN LAYERS - MAP - doesnt work at the moment..
						/*
						{name: "theMap", kind: "nbt.OpenLayers", style:"position:relative;width:480;height:700", onReady: "onMapReady", fit: true},
						*/
				]},

			]},
			/*
			=======================================
			===          SELECT REGION          ===
			=======================================
			*/
			{content:4, name:"regions_selection_view", components: [	
				{kind: "FittableRows", classes: "enyo-fit", components: [
			    		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
							{content: "Parking place", fit:true},
							{kind: "onyx.Button", content: "Done", ontap: "closePOIMap"},
			    		]},
                        {name: "regionSelectorPopup", onShow : "regionsPannnelOnShow",components: [
                                                       
                                {classes: "onyx-toolbar-inline", style:"width:80%;height:45%;", components: [
                                    {content: "City",  style:"width:100%;height:20%;",  classes:"onyx-sample-divider"},
                                    {kind: "onyx.PickerDecorator",style:"width:100%;height:60%;", components: [						
                                        {kind: "onyx.PickerButton", style:"width:120%;height:80%;color:white;background:transparent;text-align:left;",content: "Pick One..."},
                                        {kind: "onyx.Picker",  name:"cities", onSelect: "citySelected", components: []}
                                    ]}
                                ]},
                                {classes: "onyx-toolbar-inline", style:"width:80%;height:45%;top:8%;position:relative;", components: [
                                    {content: "Suburb",  style:"width:100%;height:20%;", classes:"onyx-sample-divider"},
                                    {kind: "onyx.PickerDecorator",style:"width:100%;height:60%;", components: [						
                                        {kind: "onyx.PickerButton", style:"width:120%;height:80%;color:white;background:transparent;text-align:left;",content: "Pick One..."},
                                        {kind: "onyx.Picker", name:"suburbs", onSelect: "suburbSelected", components: []}
                                    ]}
                                ]},
                        ]},  
                ]},
            ]},
			/*
			=======================================
			===          SELECT CAR             ===
			=======================================
			*/
			{content:5, name:"cars_selection_view", components: [
  				{kind: "FittableRows", classes: "enyo-fit", components: [
			    		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", components: [
							{content: "Parking car", fit:true},
							{kind: "onyx.Button", content: "Done", ontap: "closePOIMap"},
			    		]},
                        {fit:true},
                        {name: "carSelector", style:"width:80%;left:10%;height:85%;top:5%;position:relative;", ontap:"carSelectorOnTap", components: [
          
                            {style:"width:95%;height:5%;position:relative;", components: [
                                {name:"carSelectorContentDescription", content: "Choose your car..."},
                            ]},
                            {style:"width:95%;height:5%;position:relative;"},
                           /* {name:"carousel", arrangerKind: "TopBottomArranger", kind:"ImageCarousel", classes: "panels-sample-topbottom", lowMemory:true, style:"width:95%;height:80%;position:relative;", onTransitionFinish: "transitionFinish"},*/
                            {name:"carousel", arrangerKind: "BoxTurnArranger", kind:"ImageCarousel", classes: "panels-sample-topbottom", lowMemory:true, style:"width:95%;height:80%;position:relative;", onTransitionFinish: "transitionFinish"},
                            {style:"width:95%;height:5%;position:relative;"},
                            
                            {style:"width:95%;height:5%;position:relative;", components: [
                                {name:"carSelectorContentRegistrationPlate", content: "jhkj"},
                            ]},
                        ]},
                ]},
            ]},
		]},
		{kind: "CurrentLocation", onSuccess: "currentLocationSuccess"},

	],
    backButtonHandler: function(e, t) 
    {
        console.log("back button pressed");
        navigator.app.exitApp();
    },
	closePOIMap:function()
	{
        this.$.pullout.animateTo(100);	
        this.$.appPanels.setIndex(1);		
	},

	updateAccountCancelOnTap:function()
    {
         this.$.appPanels.setIndex(1);
    },
	// OPENLAYERS MAP FUCNTIONS
	// ========================
	/*
	onMapReady: function(inSender) {
		var map = inSender.getMap();

		var osm = new OpenLayers.Layer.OSM();
		osm.attribution = "";
		
		map.addLayer(osm);
		map.addControl(new OpenLayers.Control.LayerSwitcher());
		map.setCenter(
		    new OpenLayers.LonLat(-97, 38).transform(
		        new OpenLayers.Projection("EPSG:4326"),
		        map.getProjectionObject()
		    ), 
		    4
		);
		console.log(map);
    	},
	onNbtTap: function(inSender) {
		window.location = "http://www.nbtsolutions.com";
	},
	*/
	// NOTIF RELATED FUNCTIONS
	// =======================
	callb: function(notification) { alert("TBD!"); },
	sendNotif: function(theme, stay, duration, title, message) 
	{
		this.$.notif.sendNotification({
			title: title,
			//message: new Date(),
			message: message,
			icon: "assets/warning-4.png",
			theme: theme,
			stay: stay,
			duration: duration
		}, enyo.bind(this, "callb"));
	},
	
	
	citySelected: function(inSender, inEvent) 
	{

		this.$.suburbs.destroyClientControls();
		var selected_city = cities_array.indexOf( inEvent.selected.content);
		var previous_selected_city = localStorage.getItem("chosen_region_city" );
		var previous_selected_suburb = localStorage.getItem("chosen_region_suburb" );
		// if different city - just put a default suburb untill the user choose what he likes
		if (selected_city == previous_selected_city)
		{
			return;
		}
		
		localStorage.setItem("chosen_region_suburb", 0);
		localStorage.setItem("chosen_region_city", selected_city );
		
		for (j=0;j<suburbs_array[selected_city].length;j++)
		{
			if (j == 0)
			{
				this.$.suburbs.createComponent({content: suburbs_array[selected_city][j], active:true});
			}
			else
			{
				this.$.suburbs.createComponent({content: suburbs_array[selected_city][j]});
			}
		}
		this.$.suburbs.render();
		this.$.selected_poi.setContent(inEvent.selected.content +",\n" + suburbs_array[selected_city][0]);
		//this.sendNotif("notification.MessageBar", undefined, 1, "selected region " + inEvent.selected.content); 
	}, 
	suburbSelected: function(inSender, inEvent) 
	{
		 
		var selected_city_id = localStorage.getItem("chosen_region_city");
		var selected_suburb_id = suburbs_array[selected_city_id].indexOf( inEvent.selected.content);
		localStorage.setItem("chosen_region_suburb", selected_suburb_id);
		this.$.selected_poi.setContent(cities_array[selected_city_id]  +",\n" + suburbs_array[selected_city_id][selected_suburb_id]);
		//this.$.regionSelectorPopup.hide();
        this.$.appPanels.setIndex(1);
        
		//this.sendNotif("notification.MessageBar", undefined, 1, "selected region " + inEvent.selected.content); 
	}, 
	transitionFinish: function(inSender, inEvent) 
	{
		//console.log("carousel moved to " + inEvent.toIndex);
		if (cars_data)
		{
			if (inEvent.toIndex < cars_data.length)
			{
				this.$.carSelectorContentRegistrationPlate.setContent(cars_data[inEvent.toIndex].registration);
				this.$.carSelectorContentDescription.setContent(cars_data[inEvent.toIndex].Name);
				this.$.selected_car.setContent(cars_data[inEvent.toIndex].Name);
				localStorage.setItem("chosen_car", inEvent.toIndex);
			}
		}
	}, 
	create: function() {
		this.inherited(arguments);
		//this.$.uaString.setContent(navigator.userAgent);
		//this.$.enyoPlatformJSON.setContent(JSON.stringify(enyo.platform, null, 1));
		//this.updateWindowSize();
	}, 
	deviceReady: function()
	{
        console.log("enyo-onDeviceReady");
        // respond to deviceready event
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) 
		{
			onDeviceReadyCamera();
		}
		else
		{
			
		}
		getLocation(this);
    }, 
    init_containers_size:function(height,width)
    {
 		home_height= height*0.95; //this.$.appPanels.getBounds().height*0.95;
		home_width =width; //this.$.appPanels.getBounds().width;
		container_height = home_height*0.33;
	
		bmin= Math.min(home_width, container_height);
		w = bmin*0.75;
		h = w;
		t = bmin*0.125*0.5;
		l = home_width*0.1*0.3;
		
		this.$.car.setStyle("width:"+w+"px;height:"+h+"px;position:relative;top:"+t+"px;left:"+l+"px;");    	
	 	this.$.car_container.setStyle("width:"+w+"px;height:"+bmin+"px;position:relative;top:"+t+"px;left:"+l+"px;");    	
		this.$.selected_car.setStyle("position:relative;top:"+ (-h+t) +"px;left:"+home_width*0.5+"px;");    	

       	this.$.poi.setStyle("width:"+w+"px;height:"+h+"px;position:relative;top:"+t+"px;left:"+l+"px;");    	
       	this.$.poi_container.setStyle("width:"+w+"px;height:"+bmin+"px;position:relative;top:"+t+"px;left:"+l+"px;");    	
		this.$.selected_poi.setStyle("position:relative;top:"+ (-h+t) +"px;left:"+home_width*0.5+"px;");    	

	 	this.$.action.setStyle("width:"+w+"px;height:"+h+"px;position:relative;top:"+t+"px;left:"+l+"px;");    	
	 	this.$.action_container.setStyle("width:"+w+"px;height:"+bmin+"px;position:relative;top:"+t+"px;left:"+l+"px;");    	
		this.$.selected_action.setStyle("position:relative;top:"+ (-h+t) +"px;left:"+home_width*0.5+"px;");
    },  
    update_user_data_from_storage:function()
    {
        	user_data_str = window.localStorage.getItem("user_data");
			user_data = null;
			if(user_data_str!="") 
            {
			    user_data = JSON.parse(user_data_str);
			}

    },
    setWhereDidIParkOption:function()
    {
            var x_pos = localStorage.getItem("last_parking_lat");
		    var y_pos = localStorage.getItem("last_parking_lon");
            
            if ((x_pos==0) || (y_pos ==0))
            {
                this.$.pullout.$.whereDoIPark.setStyle("opacity:0.4");
                //this.$.pullout.$.whereDoIPark.$.icon.disabled = true;
            }
            else
            {
                this.$.pullout.$.whereDoIPark.setStyle("opacity:1");
                lastParkingPOIValid = true;
            }

    },
	loadHandler:function(source, event) 
	{
		if (app_initialized == false)
		{
			app_initialized = true;

            prefill_local_storage();

			use_geolocation = window.localStorage.getItem("use_geolocation");
            // if we use gelocation we will continously track location
            if (use_geolocation == true)
            {
                this.owner.$.currentLocation.go();
            }
            else 
            {
                // a one time current location finding 
                this.findCurrentLocation();
            }
            this.setWhereDidIParkOption();            
			// are we running in native app or in browser?
			window.isphone = false;
			if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) 
			{
				window.isphone = true;
				//console.log("window.isphone");
			} 
            else
            {
				this.deviceReady();
            }

			_serverApi = new serverApi();
			
			// check if user data is already in local storage
		    cars_data = JSON.parse(localStorage.getItem('cars_data'));
            
            this.update_user_data_from_storage();
            this.update_regions_and_rates_from_storage();
            
			auto_login = window.localStorage.getItem("auto_login");
			if (auto_login == "true")
			{
				//console.log("auto login");
				if ((_serverApi.auth_token != "" ) && (_serverApi.auth_token != null ))
				{
					this.$.appPanels.setIndex(1);
					this.init_containers_size( this.$.appPanels.getBounds().height,  this.$.appPanels.getBounds().width);

					this.set_up_regions_text();
					this.set_up_cars_text();
					this.set_up_parking_pannel();
				}
			}
			else if (user_data!=null)
			{
				this.$.userid.setValue( user_data['user']['email']);
				this.$.userpass.setValue(user_data['user']['password']);
			}
			// debug
		    //this.$.appPanels.setIndex(1);     			
		}
    },
	/* ======= LOGIN ON-TAPS ========== */
	loginCancelOnTap: function(inSender, inEvent) {
		this.$.loginPanels.setIndex(0);
	},
	loginOnTap: function(inSender, inEvent) 
	{
		//this.$.loginPanels.getBounds().height;
		this.$.loginPanels.setIndex(1);
		this.init_containers_size( this.$.loginPanels.getBounds().height,  this.$.loginPanels.getBounds().width);
	},
	loginButtonOnTap:function(inSender, inEvent) 
	{
		var email = this.$.userid.getValue();
		var password = this.$.userpass.getValue();
		user_data = {user:{email:email,password:password}};
		user_data_str = JSON.stringify(user_data);
		window.localStorage.setItem("user_data",user_data_str);

		
		this.$.spinnerPopupContent.setContent("Login...");	
		this.$.spinnerPopup.show();

		// if storage is empty (user has logoff before..) initialize everything ...
		prefill_local_storage();
		
		var parent = this;
		_serverApi.sign_in({
		    data: user_data,
		    success: function(response)  
		    {
			    //get the full user info and store locally
			    _serverApi.get_user({
				success: function(response)  
				{
				    //console.log('_serverApi.get_user: response' + response);
				    user_data = response;
				    user_data_str = JSON.stringify(user_data);
				    //window.localStorage.setItem("user_data",user_data_str);
				    
				    // check to see if we need to update local storage database from server 
				    var d = new Date();
					var now = d.getTime();
					var last_server_update =  window.localStorage.getItem("last_server_update");
					
					//console.log("now " + now);
					//console.log("last_server_update = " + last_server_update);
					
					if ((last_server_update === null) || (last_server_update === "") || ((now - last_server_update)>1000) )
					{
						console.log("*** UPDATING FROM SERVER ***");
						parent.update_regions_and_rates_from_server();
						parent.update_cars_list_from_server();
						//parent.set_up_regions_text();
						//parent.set_up_cars_text();
						window.localStorage.setItem("last_server_update", now);
					}
					else
					{
						parent.set_up_cars_text();
                        parent.set_up_regions_text();						
                        parent.set_up_parking_pannel();
					}
				    parent.$.appPanels.setIndex(1);
				    parent.$.spinnerPopup.hide();
				},
				error: function(errorThrown)  
				{
				    console.log('_serverApi.get_user failed: ' + errorThrown);
				    alert(errorThrown);
				    parent.$.spinnerPopup.hide();
				}
			    });
			    //console.log('_serverApi.sign_in response: ' + _serverApi.auth_token);
		    },
		    error: function(errorThrown)  
		    {
			    parent.$.spinnerPopup.hide();
			    alert('Login failed: ' + errorThrown);
		    }
		});

	},
	set_up_regions_text:function()
	{
        if (use_geolocation == false)
        {
            chosen_region_city  = window.localStorage.getItem("chosen_region_city");
            chosen_region_suburb  = window.localStorage.getItem("chosen_region_suburb");
            cities_array = JSON.parse(localStorage.getItem('cities_array'));
            suburbs_array = JSON.parse(localStorage.getItem('suburbs_array'));
            
            if ((cities_array != null) && (cities_array.length>0) &&  (suburbs_array != null) && (suburbs_array.length > 0) && (chosen_region_city >= 0) 
                        && (chosen_region_suburb >= 0) && (chosen_region_city != null) && (chosen_region_suburb != null) && cities_data )
            {
                this.$.selected_poi.setContent(cities_array[chosen_region_city] +",\n" + suburbs_array[chosen_region_city][chosen_region_suburb ]);
            }
        }
        else
        {
                this.$.selected_poi.setContent(localStorage.getItem('geolocation'));
        }
	},
	set_up_regions_pannel:function()
	{

		// set the persistent storage parmaters values in the GUI for POI/Regions/Cities/Suburbs
		chosen_region_city  = window.localStorage.getItem("chosen_region_city");
		chosen_region_suburb  = window.localStorage.getItem("chosen_region_suburb");
		cities_array = JSON.parse(localStorage.getItem('cities_array'));
		suburbs_array = JSON.parse(localStorage.getItem('suburbs_array'));
		cities_data = JSON.parse(localStorage.getItem('cities_data'));
		
		// now set up the picker with active (chosen) according to localstorage 
		this.$.suburbs.destroyClientControls();
		this.$.cities.destroyClientControls();
		
		for (i=0;i<cities_array.length;i++)
		{
			if (i == chosen_region_city)
			{
				this.$.cities.createComponent({content: cities_array[i], active:true});
				for (j=0;j<suburbs_array[i].length;j++)
				{
					if (j == chosen_region_suburb)
					{
						this.$.suburbs.createComponent({content: suburbs_array[i][j], active:true});
					}
					else
					{
						this.$.suburbs.createComponent({content: suburbs_array[i][j]});
					}
				}
			}
			else
			{
				this.$.cities.createComponent({content: cities_array[i]});	
			}
		}
		this.$.suburbs.render();
		this.$.cities.render();
		this.set_up_regions_text();		 
	},
	set_up_parking_pannel:function()
	{
		// PARKING CONTAINER INIT
		// =========================
		var parking_status = localStorage.getItem("ParkingActive");
		if (parking_status == "true")
		{
				gParkingActive = true;
				this.digitized();
				this.$.selected_action.setContent('Active');
		}
		else 
		{
				gParkingActive = false;
				localStorage.setItem("ParkingActive", false);
				console.log('parking stoped');
				this.$.selected_action.setContent('Press to start');
		}					
	},
	/* ======= SIGN UP ON-TAPS ========== */
	signupOnTap: function(inSender, inEvent) 
	{
		this.$.loginPanels.setIndex(2);	
	},
	signupButtonOnTap:function(inSender, inEvent) 
	{
	    var firstname = this.$.firstname.getValue();
		var lastname = this.$.lastname.getValue();
		var phone = this.$.phone.getValue();
		var credit_card_number = this.$.credit_card_number.getValue();
		var id_card_number = this.$.id_card_number.getValue();
		var email = this.$.email_signup.getValue();
		var password = this.$.password_signup.getValue();
		
		this.$.spinnerPopupContent.setContent("Signing up...");	
		this.$.spinnerPopup.show();

		var parent = this;

		//TODO: add phone and credit_card_number to server, add as accessible attr
		//, phone: phone, credit_card_number: credit_card_number, id_card_number: id_card_number
		user_data = {user: {email: email, password: password, password_confirmation: password, firstname: firstname, lastname: lastname } } 
		user_data_str = JSON.stringify(user_data);
		window.localStorage.setItem("user_data",user_data_str);

		_serverApi.sign_up({
		    data: user_data,
		    success: function(response)  
		    {
			//parent.$.appPanels.setIndex(1);
			parent.$.spinnerPopup.hide();
			alert("A verification link has been sent to you email. Please follow the instructions sent in that email and then login again")
			parent.$.appPanels.setIndex(0);
		    },
		    error: function(errorThrown)  
		    {
			parent.$.spinnerPopup.hide();
			alert('Signup Failed');
			//parent.$.loginPanels.setIndex(0);
		    }
		});
	},

    /* ====== HOME ON-TAPS ===========*/
	CarSelectTap: function(inSender, inEvent) 
	{
		if (cars_data)
		{	
			if (cars_data.length > 0)
			{	
                this.set_up_cars_pannel();
				this.$.appPanels.setIndex(5);
			}
		}
		else
		{
			this.sendNotif("notification.MessageBar", undefined, 1, "Error", "No cars registered yet");
		}
	},
	RegionSelectTap: function(inSender, inEvent) 
    {
        if (use_geolocation == false)
        {
            this.$.appPanels.setIndex(4);
            this.set_up_regions_pannel();
        }
	},
    regionsPannnelOnShow:function(inSender, inEvent)
    {
        //this.set_up_regions_pannel();
    },
	carSelectorOnTap: function(inSender, inEvent) 
	{
		this.$.appPanels.setIndex(1);
	},
/*
	processResponse: function(inSender, inResponse) {
		// do something with it
		console.log(JSON.stringify(inResponse, null, 2));
	},
	processError: function(inSender, inResponse) {
		alert("Error!");
	},
*/
	cancelAddCarOnTap : function(inSender, inEvent) {
		this.$.appPanels.setIndex(1);
	},
	delCarID:function(car_ind)
	{
		//console.log("del a car with ID " + car_ind);

		var data = {car: { archive: true}};
		
		this.$.spinnerPopupContent.setContent("Updating...");	
		this.$.spinnerPopup.show();
		var parent = this;
	 
		if ((car_ind!=null) && (cars_data.length > 0))
        {
		    _serverApi.update_cars({ id: cars_data[car_ind].ID, data: data,
		        success: function(response)
		        {
		            	// in success - update the car list in the storage
                        parent.update_cars_list_from_server();
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
                            // lower index than the one chosen is deleted - got to update the index to 
                            // reflect the right chosen one now that one weas deleted
                            if (chosen_car > car_ind) 
                            {
                                localStorage.setItem("chosen_car", chosen_car - 1);
                            }
                        }
                        // update & close pullout then go to home screen
                        parent.$.pullout.animateTo(100);	
		    	    	parent.$.appPanels.setIndex(1);
		            	parent.$.spinnerPopup.hide();    
		        },
		        error: function(error)
		        {
		            console.log(error);
		            parent.$.spinnerPopup.hide();
		        }});
		}
	},
	addACarOnTap:function(inSender, inEvent)
	{
		//console.log("add a car");
	
		this.$.spinnerPopupContent.setContent("Updating...");	
		this.$.spinnerPopup.show();

		var registration = this.$.regnum.getValue();
		var car_description = this.$.description.getValue();
		var car_image_data =  this.$.carImage.src;
		
		var data = {car: {license_plate: registration, car_description: car_description}};
	
		//console.log("calling _serverApi.add_cars");
		
		var parent = this;
	
		_serverApi.add_cars({ data: data, 
			success: function(response) 
			{
				console.log("success: function " + response);
				var car_id = response.id;
				//console.log("uploadPhoto:"+car_image_data);
				if (gimageURI == undefined)
				{
					gimageURI = "assets/car.png";
				}
                console.log("uploading " + gimageURI);
				uploadPhoto(car_id, gimageURI /*car_image_data*/);
				//console.log(response);
				if (localStorage.getItem("chosen_car") == "undefined")
				{
					localStorage.setItem("chosen_car",0); // this will be the default chosen car in case there is only one car
				}
				parent.$.spinnerPopup.hide();

				// lets update the cars carousel with the updated server data
				parent.update_cars_list_from_server();
				parent.$.appPanels.setIndex(1);
			},
			error: function(error) 
			{
				console.log("uploadPhoto error:"+ error);
				alert(format_error_string(error));
				parent.$.spinnerPopup.hide();
			}}
		);
		
	},
	takePhotoOnTap: function(inSender, inEvent)
	{
		var parent = this;
		function onSuccess(imageURI) 
		{
			console.log("onSuccess - imageURI = " + imageURI); // this is of the form file://mnt/sdcard..../ 
			window.resolveLocalFileSystemURI(imageURI, onResolveSuccess, onFail);
			gimageURI = imageURI; // the file name is kept so that the file transfer to the server later on can succeed...
		}

		function onFail(message) 
		{
		    alert('Failed because: ' + message);
		}
		
		function onResolveSuccess(fileEntry) 
		{
			function win(file) 
			{
                console.log("navigator.camera.getPicture-onResolveSuccess - onSuccess");
			    var reader = new FileReader();
			    reader.onloadend = function (evt) 
			    {
                    console.log("onloadend - read success");
                    parent.$.carImage.setSrc(evt.target.result);
			    };
			    reader.readAsDataURL(file);
			};

			var fail = function (evt) 
			{
                console.log("navigator.camera.getPicture-fail");
			    console.log(error.code);
			};
			fileEntry.file(win, fail);
			console.log(fileEntry.name);
		    	
		};
        console.log("calling navigator.camera.getPicture"); 
        /*
		navigator.camera.getPicture(onSuccess,onFail,{
		    quality: 50,
		    destinationType:  navigator.camera.DestinationType.FILE_URI,
            correctOrientation:true,
            targetWidth:400,
            targetHeight:400
		});
        */
		navigator.camera.getPicture(onSuccess,onFail,{
		    quality: 50,
		    destinationType: Camera.DestinationType.FILE_URI
		});
	},
	set_up_cars_text:function()
	{
		chosen_car = window.localStorage.getItem("chosen_car");
		cars_data = JSON.parse(localStorage.getItem('cars_data'));
        if (cars_data.length>0)
        {
            if (chosen_car > cars_data.length - 1)
            {
                chosen_car = 0;
            }
		    this.$.selected_car.setContent(cars_data[chosen_car].Name);
        }
        else
        {
              this.$.selected_car.setContent("Please add a Car");  
        }
    },
	set_up_cars_pannel:function()
	{
		// set the persistent storage parmaters values in the GUI for CARS
		chosen_car = window.localStorage.getItem("chosen_car");
		var cars_data_from_storage = localStorage.getItem('cars_data');
		if (cars_data_from_storage)
		{
			cars_data = JSON.parse(localStorage.getItem('cars_data'));
			
			this.update_cars_list_from_storage();
			this.$.carousel.setImages(car_assets_url);
            this.$.carousel.imagesChanged();
            //this.$.carousel.render();
			
			//console.log("chosen_car = " + chosen_car);
			//console.log("cars_data.length = " + cars_data.length);
			
			if (chosen_car && cars_data)
			{
				if (cars_data.length > 0 )
				{
					if (chosen_car == null)
					{
						chosen_car = 0;
					}
					// see if we just deleted the chosen car in the cars pannel
					if (chosen_car > (cars_data.length  - 1))
					{
						//chosen_car = cars_data.length - 1;
						chosen_car = 0;
					}
					// carousel popup persistency
					
					this.$.carSelectorContentRegistrationPlate.setContent(cars_data[chosen_car].registration);
					this.$.carSelectorContentDescription.setContent(cars_data[chosen_car].Name);
					this.$.carousel.setIndex(chosen_car);
					// cars panel persistency
					this.$.selected_car.setContent(cars_data[chosen_car].Name);
				}
				else
				{
					this.$.selected_car.setContent("No car registered yet");
				}
			}
		}
		else
		{
			this.update_cars_list_from_server();
		}
	},
	update_regions_and_rates_from_storage: function()
    {
		cities_data = JSON.parse(localStorage.getItem('cities_data'));
		            
        for (j=0;j<cities_data.length;j++)
        {
            cities_array[j] = cities_data[j].name;
            suburbs_array[j] = [];
            for (k=0;k<cities_data[j].areas.length;k++)
            {
                suburbs_array[j][k] = cities_data[j].areas[k].name;
            }
        }
        localStorage.setItem('cities_array', JSON.stringify(cities_array));
        localStorage.setItem('suburbs_array', JSON.stringify(suburbs_array));
    },        
	update_regions_and_rates_from_server: function()
    {
		var parent = this;
		//this.$.spinnerPopupContent.content = "Syncing...";	
		//this.$.spinnerPopup.show();
		var cities_array = [];
		var suburbs_array = [];

		_serverApi.get_rates({
		    success: function(response) {
		        if(response!=null) {
		            localStorage.setItem('cities_data', JSON.stringify(response));
		            cities_data = JSON.parse(localStorage.getItem('cities_data'));
		            
		            for (j=0;j<cities_data.length;j++)
                    {
		            	cities_array[j] = cities_data[j].name;
		            	suburbs_array[j] = [];
		            	for (k=0;k<cities_data[j].areas.length;k++)
		            	{
		            		suburbs_array[j][k] = cities_data[j].areas[k].name;
		            	}
			        }
		            localStorage.setItem('cities_array', JSON.stringify(cities_array));
		            localStorage.setItem('suburbs_array', JSON.stringify(suburbs_array));
			 	
	            
		            if (use_geolocation == false)
		            {
                        // we update only the text  now since we;re not sure if the pannels have a DOM node yet
                         parent.set_up_regions_text();
		            }
                    //console.log('End of update_regions_and_rates_from_server success callback');
		            //parent.$.spinnerPopup.hide();
		        } 
		        else 
		        {
		            console.log('Empty rates list received');
		            //parent.$.spinnerPopup.hide();
		        }
		    },
		    error: function(error)
		    {
		        console.log(error);
		        //parent.$.spinnerPopup.hide();
		        parent.sendNotif("notification.MessageBar", undefined, 3, "Failed fetching rates: " + error); 
		        //alert('Failed fetching rates');
		    }
		});
    },
	update_cars_list_from_storage : function()
	{
		var index = 0;
		car_assets_url = [];
		cars_data = JSON.parse(localStorage.getItem('cars_data'));
		
		this.$.pullout.fillDeleteCarDrawer(cars_data);
		for (i= 0; i< cars_data.length; i++)
		{
			
            // the following line is for working with url
            //car_assets_url.push(cars_data[i].PictureUrl);
            // this is for working with data - it's quicker and cache the images in local storage so less
            
            // load on the server 
            var p =  localStorage.getItem('picture_for_car_' + i );
			if (p)
            {
                car_assets_url.push(p);
            }
            else
            {
                car_assets_url.push("http://ozpark.com.au/img/thumb/missing.png");
            }
            
		}
	},
    delete_cars_pictures_from_storage:function()
    {
        for (i=0; i<=localStorage.length-1; i++) 
        { 
           key = localStorage.key(i);
           if (key.indexOf("picture_for_car_") == 0)
           {
               localStorage.removeItem(key);
           }
       }
    },
	update_cars_list_from_server : function()
	{
		var parent = this;
		//this.$.spinnerPopupContent.setContent("Syncing....");	
		//this.$.spinnerPopup.show();
		this.sendNotif("notification.MessageBar", undefined, 1,"Info", "Updating cars list from server");
		
        
		_serverApi.get_cars({
			success: function(response) 
			{
			    	if(response!=null)
			    	{
					   //console.log(response);
                        parent.delete_cars_pictures_from_storage();
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
                                //"PictureData": "data:Image/*;base64,"+base64_encode (httpGet("http://"+response[i].image_url)),
                                //"PictureData": "data:image/png;base64,"+base64_encode (httpGet("http://"+response[i].image_url)),
                                "Name": response[i].car_description});
                                // the following will fetch asyncronously and put the car piture in the local storage and update the display
                                asyncHttpGet("http://"+response[i].image_url, index, parent);  
                                console.log("fetching " + "http://"+response[i].image_url);
                                index++; // index of archived cars is not incremented
                            }
                        }
                        localStorage.setItem('cars_data', JSON.stringify(jsonObj) );
                        cars_data = JSON.parse(localStorage.getItem('cars_data'));
                        if (cars_data == null)
                        {
                            cars_data = [];
                        }
                        parent.$.pullout.fillDeleteCarDrawer(cars_data);
                        // we update only the text of the panne sinc we're not sure the DOM contains 
                        // the cars popup yet
                        parent.set_up_cars_text();
                        //parent.$.spinnerPopup.hide();
                    } 
                    else 
                    {
                        console.log('Empty car list received');
                            //parent.$.spinnerPopup.hide();
                    }
			},
			error: function(error)
			{
			    console.log("serverApi.get_cars error:" + error);
			    //parent.$.spinnerPopup.hide();
			}
		});
	},

	
	// ============================================
	// PARKING AND PAYMENT FUNCTIONS 
	// ============================================
	
  	ActionSelectTap: function() 
    {
    		//debugger;
	    	var chosen_car = localStorage.getItem("chosen_car");
    		pid1 = localStorage.getItem("chosen_region_city");
    		pid2 = localStorage.getItem("chosen_region_suburb");
    		if (use_geolocation == false)
    		{
	    		if ((chosen_car == "undefined") || (pid1 == null) || (pid2 == null)) 
		    	{
			    	this.sendNotif("notification.MessageBar", undefined, 1,"Error", "Please set the car and location first");
	    			return;
	    		}
	    	}
	    	else
	    	{
	    		if (chosen_car == "undefined")  
		    	{
		    		this.sendNotif("notification.MessageBar", undefined, 1, "Please set the car first");
	    			return;
	    		}
	    		if  ((pid1 == null) || (pid2 == null)) 
		    	{
	    			this.sendNotif("notification.MessageBar", undefined, 1, "Location not in database. Please call support");
                    return;
	    		}
	    	}
	    	if (cars_data.length == 0)
	    	{
	    		this.sendNotif("notification.MessageBar", undefined, 1, "Error", "No cars registered yet");
	    		return;
	    	}	 
            pid  = 	cars_data[chosen_car].ID;
            status = localStorage.getItem("ParkingActive");
            var dt = new Date(); 
            if ((status == "false")) 
            {
    			
    			this.start_payment(dt);
    		}
    		else 
            {
	            this.stop_payment(dt);
    		}
     },
	start_payment :  function(start_time)
    {
        this.saveParkingLocation();
        
        this.setWhereDidIParkOption();
        
		var x_pos = localStorage.getItem("last_parking_lat");
		var y_pos = localStorage.getItem("last_parking_lon");
	
		var city_index;
		var suburb_index;
	
		var parent = this;
		this.$.homeSpinnerPopupContent.setContent("Starting Parking...");
		this.$.homeSpinnerPopup.show();

		 
		if (use_geolocation)
		{
			geolocation = localStorage.getItem('geolocation');
			// TODO - find pids from the location string and area in memory database
			city_index = 0;
			suburb_index = 0;
		}
		else
		{
			city_index = parseInt(localStorage.getItem("chosen_region_city"),10);
			suburb_index = parseInt(localStorage.getItem("chosen_region_suburb"),10);
		}

        // 2013-07-01T20:19:18Z
		var st=start_time.getFullYear()+"-"+start_time.getMonth()+"-"+start_time.getDate()+"T"+start_time.getHours()+":"+start_time.getMinutes()+":"+start_time.getSeconds()+"Z";
	
		var area_id = cities_data[city_index].areas[suburb_index].id;
		//var rate_id = parseInt(localStorage.getItem("chosen_rate_id"),10);
		var chosen_car = localStorage.getItem("chosen_car");
		var car_id = cars_data[chosen_car].ID;
		
		//console.log("start_payment: st="+st+",area="+area_id+",rate="+rate_id+",user="+user_data.user.id + " car=" + car_id );
		console.log("start_payment: st="+st+",area="+area_id+",user="+user_data.user.id + ",car=" + car_id );
		
		//var data = {payment:{ car:car_id, x_pos: x_pos, y_pos: y_pos, area_id: area_id, rate_id: rate_id, user_id: user_data.user.id, start_time: st}};
		var data = {payment:{ car_id:car_id, x_pos: x_pos, y_pos: y_pos, area_id: area_id, user_id: user_data.user.id, start_time: st}};
		_serverApi.add_payment({
				data: data, 
				success: function(response) {
					//console.log(response);
					localStorage.setItem("payment_id", response.id);
					console.log("payment_id="+response.id);
		   			gParkingActive = true;
		    			localStorage.setItem("ParkingActive", true);
		    			localStorage.setItem("ParkingStartTime", start_time);
		    			parent.digitized();
		    			console.log('parking started');
		    			parent.$.selected_action.setContent('Starting...');
					parent.$.homeSpinnerPopup.hide();
				},
				error: function(error) 
				{
					parent.$.homeSpinnerPopup.hide();
					console.log(error);
					parent.sendNotif("notification.MessageBar", undefined, 3, "Error", error);
					//alert(error);
					localStorage.setItem("payment_id", -1);
				}});
	},
    stop_payment:function(end_time)
    {
		var parent = this;
		this.$.homeSpinnerPopupContent.setContent("Stoping Parking...");	
		this.$.homeSpinnerPopup.show();
		
	    var payment_id = parseInt(localStorage.getItem("payment_id"),10);
	    var et=end_time.getFullYear()+"-"+end_time.getMonth()+"-"+end_time.getDate()+"T"+end_time.getHours()+":"+end_time.getMinutes()+":"+end_time.getSeconds()+"Z";
		console.log("stop_payment: et="+et+",payment_id="+payment_id);
	    var data = { end_time: et};
	    _serverApi.update_payment({ 
			id:payment_id,data: data, 
			success: function(response) 
			{
				//console.log(response);
	    			gParkingActive = false;
	    			localStorage.setItem("ParkingActive", false);
	    			console.log('parking stoped');
	    			parent.$.selected_action.setContent('Press to Start');

 				parent.$.homeSpinnerPopup.hide();
			},
			error: function(error) 
			{
				console.log(error);
				parent.$.homeSpinnerPopup.hide();
			}});

    },
	digitized: function() 
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
	
		if (gParkingActive) {
			var innerHTML1 = hrs + ":" + min + ":" + sec; 
			var rate = localStorage.getItem("chosen_region_rate");
			var innerHTML2 = parseInt(sec * rate ) + '$';   
			this.$.selected_action.setContent(innerHTML1 + " - " + innerHTML2);       
		}

		var time;
		var parent = this;
	
		// THE ALL IMPORTANT PRE DEFINED JAVASCRIPT METHOD.
		if (gParkingActive) 
		{
			enyo.job("digitized", enyo.bind(this, "digitized"), 1000);
			//time = setTimeout('parent.digitized()', 1000);      
		}
	},
	debug:function()
	{
        for (i=0; i<=localStorage.length-1; i++) 
        { 
            key = localStorage.key(i);
            console.log(key + " : " + localStorage.getItem(key));
       }

	        //window.localStorage.clear();
	       // console.log("local storage cleared");
	},
	
	// MAP RELATED FUNCTIONS
	// ===================
	
	findCurrentLocation: function() 
	{
		var glat = localStorage.getItem("geolocation_lat");
		var glon = localStorage.getItem("geolocation_lon");
		if ((glat > -90) && (glat < 90) && (glon > -180) && (glon < 180) && (glon!=0) && (glat!=0))
		{
			//this.$.google_map.setCenter(glat, glon);
			//this.$.google_map.setZoom(14);
            
			//this.currentLocationPin = this.$.google_map.updatePushpin(this.currentLocationPin, glat, glon,
			//	{icon: "assets/mylocation.png", height: 48, width: 48, anchor: new Microsoft.Maps.Point(24, 24)});
		}
		else
		{
			//this is for the current location if there is no last parking point 
			this.$.currentLocation.go();
		}
	},
	currentLocationSuccess: function(inSender, inData)
	{
		var c = inData.coords;
        localStorage.setItem("geolocation_lat",c.latitude);
        localStorage.setItem("geolocation_lon",c.longitude);
        console.log("onGeolocationSuccess = "+ c.latitude + "," + c.longitude);
		/*
		this.$.google_map.setCenter(c.latitude, c.longitude);
		this.$.google_map.setZoom(14);
		*/
		if (use_geolocation == false)
        {
            inSender.stopTracking();
        }
        else
        {
                this.sendNotif("notification.MessageBar", undefined, 1, "Current Location: " + c.latitude + "," + c.longitude); 
                
                if (typeof google === "undefined")
                {
                }
                else
                { 
                    var parent = this;
                    var geocoder = new google.maps.Geocoder();
                    var latlng = new google.maps.LatLng(c.latitude, c.longitude);
                    geocoder.geocode({ "latLng": latlng }, function (results, status) 
                    {
                        if (status == google.maps.GeocoderStatus.OK) 
                        {
                            if ((results.length > 1) && results[1]) 
                            {
                                //$("#region_selection_item_title").html(results[1].formatted_address);
                                //console.log("onGeolocationSuccess = "+ results[1].formatted_address);
                                localStorage.setItem('geolocation',results[0].formatted_address);
                                parent.set_up_regions_text();
                                //alert('geolocation ' + results[1].formatted_address);
                            }
                        }
                    });
                }
       }

        /*
		this.currentLocationPin = this.$. bing_map.updatePushpin(this.currentLocationPin, c.latitude, c.longitude,
			{icon: "assets/mylocation.png", height: 48, width: 48, anchor: new Microsoft.Maps.Point(24, 24)});
		*/
	},
    saveParkingLocation:function()
    {
		var glat = localStorage.getItem("geolocation_lat");
		var glon = localStorage.getItem("geolocation_lon");
		if ((glat == 0) || (glon == 0))
		{
			//localStorage.setItem("geolocation_lat",c.latitude);
			//localStorage.setItem("geolocation_lon",c.longitude);
		}
        else
        {
			localStorage.setItem("last_parking_lat",glat);
			localStorage.setItem("last_parking_lon",glon);
            lastParkingPOIValid = true;
        }
        
    },
});

