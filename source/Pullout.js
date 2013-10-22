enyo.kind({
	name: "Pullout",
	kind: "enyo.Slideable",
	events: {
		onDropPin: "",
	},
	handlers: {
    		onload: "loadHandler"
	},
	components: [
		{name: "shadow", classes: "pullout-shadow"},
		{kind: "onyx.Grabber", classes: "pullout-grabbutton"},
		{kind: "FittableRows", classes: "enyo-fit", components: [
			{name: "client", classes: "pullout-toolbar"},
			{fit: true, style: "position: relative;", components: [
				{name: "info", kind: "Scroller", classes: "enyo-fit", components: [
					{kind: "onyx.Groupbox", classes: "settings", components: [
						{kind: "onyx.GroupboxHeader", content: "General"},
						{kind: "LabeledItem", name:"useGeolocationToggleButton", label: "Use Geolocation", 
							icon: "assets/map-type-satellite.png", defaultKind: "onyx.ToggleButton", onChange: "useGeolocationChange"},
						{kind: "LabeledItem", name:"autoLoginToggleButton", label: "Auto login", 
							icon: "assets/login.png", defaultKind: "onyx.ToggleButton",onChange: "autoLoginChange"},
					]},
					{kind: "onyx.Groupbox", classes: "onyx-groupbox settings", components: [
					/* {name: "mapType", kind: "Group", classes: "onyx-groupbox settings", highlander: true, onchange: "mapTypeChange", components: [ */
						{kind: "onyx.GroupboxHeader", content: "Account"},
						{kind: "PulloutItem", label: "Add a Car", icon: "assets/add.png" , ontap: "showPopup"},
						{kind: "PulloutItem", label: "Remove a Car", icon: "assets/remove.png", ontap: "deleteCarDrawer"},
						
						{name: "drawer", kind: "onyx.Drawer", open: false, visible:false,
								style:"position:absolute;display:none;", content:"Remove a car", components: [
							{name:"title", content: "Nothing to delete...", classes:"car_to_delete",	ontap:"deleteCarID"},
						]},
						{kind: "PulloutItem", label: "Edit account details", icon: "assets/edit.png",  ontap:"editAccountOnTap"},
						{kind: "PulloutItem", name: "whereDoIPark", label: "Where do I park?", icon: "assets/icon-dropPin.png", ontap:"showMap"},
						{kind: "PulloutItem", label: "Logout", icon: "assets/logout.png", ontap:"logoutOnTap"},
						//{kind: "PulloutItem", label: "Debug", icon: "assets/logout.png", ontap:"debugOnTap"},
					]}
					
				]},
                /*
				{name: "bookmark", kind: "FittableRows", showing: false, classes: "enyo-fit", components: [
					{kind: "onyx.RadioGroup", classes: "bookmark-header", components: [
						{content: "Saved", active: true},
						{content: "Recents"}
					]},
					{fit: true, kind: "Scroller", classes: "bookmark-scroller", components: [
						{kind: "BookmarkList", onItemSelect: "itemSelect"}
					]}
				]}
                */
			]}
		]},
	],
	max: 100,
	value: 100,
	unit: "%", 
	debugOnTap:function()
	{
		this.owner.debug();
	},
	showMap:function ()
	{
            if (lastParkingPOIValid == true)
            {
                //this.owner.init_map();
                this.owner.$.appPanels.setIndex(3); 
                this.owner.$.google_map.apiLoadHandler();
                var x_pos = localStorage.getItem("last_parking_lat");
                var y_pos = localStorage.getItem("last_parking_lon");
        
                this.owner.$.google_map.setCenter(x_pos,y_pos);
                this.owner.$.google_map.dropPinAtCenter();
            }
	},
	fillDeleteCarDrawer: function(cars_data)
	{
		this.$.drawer.destroyClientControls();
		if (cars_data.length > 0)
        {
            for (i= 0; i< cars_data.length; i++)
            {
                this.$.drawer.createComponent({name:"carToDelete-"+i, content: cars_data[i].registration +" - " + cars_data[i].Name,
                    classes:"car_to_delete", ontap:"deleteCarID"}, {owner: this});
            }
        }
        else
        {
                this.$.drawer.createComponent({name:"NothingToDelete", content: "Nothing to delete...", classes:"car_to_delete"}, {owner: this});
        }
		this.$.drawer.render();

	},
	deleteCarDrawer: function() 
	{
		if (!this.$.drawer.open)
		{
			//this.$.drawer.setStyle("display:inline;position:relative;");
			this.$.drawer.setStyle("position:relative;");
		}
		else
		{
			this.$.drawer.setStyle("display:none;position:absolute;");
		}
		this.$.drawer.setOpen(!this.$.drawer.open);
	},
	deleteCarID:function (inSource, inEvent)
	{
		var s = inSource.id.split("-",2); // the id contains the string "carToDelete-"+i so we split by "-" and take the second string as the id of the car to del

        this.owner.sendNotif("notification.MessageBar", undefined, 3, "Deleting car " + cars_data[s[1]].Name); 
		
		this.owner.delCarID(s[1]);
		
	},
	loadHandler:function(source, event) 
	{
		//console.log("onload from " +  event.originator.src);
		this.$.autoLoginToggleButton.setValue((window.localStorage.getItem("auto_login") === "true"));
		this.$.useGeolocationToggleButton.setValue((window.localStorage.getItem("use_geolocation") === "true" ));
	},
	toggle: function(inPanelName) 
	{
		var t = this.$[inPanelName];
		if (t.showing && this.isAtMin()) 
        {
			this.animateToMax();
		}
        else 
        {
			this.animateToMin();
			this.$.info.hide();
			this.$.bookmark.hide();
			t.show();
			t.resized();
		}
	},
	autoLoginChange: function(inSender) 
	{
		var f = inSender.getValue();
		if (f !== "")
		{
			window.localStorage.setItem("auto_login",f);
		}
	},
	useGeolocationChange: function(inSender) 
	{
		var f = inSender.getValue();
		if (f !== "")
		{
			window.localStorage.setItem("use_geolocation",f);
			use_geolocation = f;
            if (use_geolocation == true)
            {
                this.owner.$.currentLocation.go();
            }
		}
	},
	logoutOnTap: function(inSender, inEvent)
	{
		console.log("logoutOnTap");
		this.owner.$.pullout.animateTo(100);
		
		// clear all remenants of current user in local storage
	    window.localStorage.clear();
		
		this.owner.$.userid.setValue("");
		this.owner.$.userpass.setValue("");
		
		this.owner.$.appPanels.setIndex(0);
	},
	addACarOnTap:function(inSender, inEvent)
	{
		console.log("logoutOnTap");
		this.owner.$.appPanels.setIndex(0);
	},
	showPopup: function(inSender) {
        this.owner.$.carImage.setSrc("assets/car.png");
        this.owner.$.regnum.setContent("");
        this.owner.$.description.setContent("");
		this.owner.$.pullout.animateTo(100);
		this.owner.$.appPanels.setIndex(2);
		//this.owner.$.modalPopup.show();
	},
    editAccountOnTap:function()
    {
		this.owner.$.pullout.animateTo(100);
        this.owner.$.loginPanels.setIndex(3);	
		this.owner.$.appPanels.setIndex(0);
    },
});

