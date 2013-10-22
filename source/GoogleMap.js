/**
A map control which is a wrapper around Bing map control.

To initialize a Map control:

	{name: "map", kind: "BingMap", credentials: "my_bing_app_id"}
	
You can get a handle to the actual Bing map control uisng hasMap(), like this:

	var bingMap = this.$.map.hasMap();
	
*/


enyo.kind({
  name: 'GoogleMap',
  kind: 'Control',
  published: {
  /*
    apiVersion: '3.8',
    otherMapParams: 'sensor=true&libraries=geometry,places',
    */
    zoom: 16,
    center: null
  },
  events: {
    onMapCreated: ''
  },
  constructor: function() {
    this.inherited(arguments);
    this.center = {
      lat: 37.787186,
      lng: -122.401037
    };
  },
  components: [
    {name: 'map', classes: 'enyo-google-map-map'},
    {name: 'client'}
  ],
  //* @protected
  create: function() {
    this.inherited(arguments);
    this.load();
  },
  load: function() 
  {
  
  	//google.maps.event.addListener(this.map, 'load', this.apiLoadHandler());
  	/*
    	google.load('maps', this.apiVersion, {
      		callback: enyo.bind(this, 'apiLoadHandler'),
      		other_params: this.otherMapParams});
      */
      //this.apiLoadHandler();
  },
  apiLoadHandler: function() {
    this.apiLoaded = true;
    if (this.hasNode()) {
      this.createMap();
    }
  },
  createMap: function() 
  {
  
    //if (this.map) 
    //{
    //  this.destroyMap();
    //}
    if (this.$.map.hasNode()) 
    {
      if (this.map)
      {
      }
      else
      {
	      this.map = new google.maps.Map(this.$.map.node, {
		center: new google.maps.LatLng(this.center.lat, this.center.lng),
		zoom: this.zoom,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		modeDiagnostics: false
	      });
	      this.doMapCreated();
      }
    }
  },
  destroyMap: function() {
    this.map = null;
  },
  updateCenter: function() {
    this.latlng = new google.maps.LatLng(this.center.lat, this.center.lng);
    this.map.panTo(this.latlng);
  },
  setCenter: function(inLat, inLng) {
    this.center.lat = inLat;
    this.center.lng = inLng;
    this.updateCenter();
  },
  dropPinAtCenter: function()
  {
 	if ( this.marker)
 	{
 		this.marker.setPosition(this.latlng);
 	}
 	else
 	{ 
		this.marker = new google.maps.Marker({
		    animation: google.maps.Animation.BOUNCE,
		    map: this.map,
		    position: this.latlng
		});
          
	}
  },
  removePin: function()
  {
  	
  },
});

